import z from 'zod';
import { publicProcedure } from '../trpc.js';
import { requireEnv } from '../requireEnv.js';

const pullRequestUrlPattern =
  /^https:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;

const query = /* GraphQL */ `
  query ($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        state
        isDraft
        commits(last: 1) {
          nodes {
            commit {
              statusCheckRollup {
                state
              }
            }
          }
        }
      }
    }
  }
`;

const responseSchema = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: z.object({
        state: z.enum(['OPEN', 'CLOSED', 'MERGED']),
        isDraft: z.boolean(),
        commits: z.object({
          nodes: z.array(
            z.object({
              commit: z.object({
                statusCheckRollup: z
                  .object({
                    state: z.enum([
                      'SUCCESS',
                      'FAILURE',
                      'ERROR',
                      'PENDING',
                      'EXPECTED',
                    ]),
                  })
                  .nullable(),
              }),
            }),
          ),
        }),
      }),
    }),
  }),
});

const stateByGitHub = {
  OPEN: 'open',
  CLOSED: 'closed',
  MERGED: 'merged',
} as const;

const ciByRollup = {
  SUCCESS: 'passing',
  FAILURE: 'failing',
  ERROR: 'failing',
  PENDING: 'running',
  EXPECTED: 'running',
} as const;

export const pullRequestStatus = publicProcedure
  .input(z.object({ url: z.url() }))
  .query(async ({ input: { url } }) => {
    const match = url.match(pullRequestUrlPattern);
    if (!match) return null;
    const [, owner, repo, number] = match;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { authorization: `Bearer ${requireEnv('GITHUB_TOKEN')}` },
      body: JSON.stringify({
        query,
        variables: { owner, repo, number: Number(number) },
      }),
    });
    if (!response.ok)
      throw new Error(`GitHub answered ${response.status} for ${url}`);

    const { pullRequest } = responseSchema.parse(await response.json()).data
      .repository;
    const rollup = pullRequest.commits.nodes[0]?.commit.statusCheckRollup;

    return {
      state:
        pullRequest.state === 'OPEN' && pullRequest.isDraft
          ? 'draft'
          : stateByGitHub[pullRequest.state],
      ci: rollup ? ciByRollup[rollup.state] : null,
    } as const;
  });
