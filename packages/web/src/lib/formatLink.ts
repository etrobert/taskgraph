const pullRequestUrl =
  /^https:\/\/(?:www\.)?github\.com\/[^/]+\/([^/]+)\/pull\/(\d+)/;

export const formatLink = (url: string) => {
  const pullRequest = url.match(pullRequestUrl);
  if (!pullRequest) return url.replace(/^https?:\/\//, '');
  const [, repo, number] = pullRequest;
  return `${repo}#${number}`;
};
