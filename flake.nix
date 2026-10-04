{
  description = "Visual task dependency graphs";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forEachSystem = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      packages = forEachSystem (pkgs: {
        default = pkgs.buildNpmPackage {
          pname = "taskgraph";
          version = "0.0.0";
          src = ./.;

          npmDeps = pkgs.importNpmLock { npmRoot = ./.; };
          npmConfigHook = pkgs.importNpmLock.npmConfigHook;

          nativeBuildInputs = [ pkgs.makeWrapper ];

          # Keeps the repository layout: the server finds the migrations and
          # the web build relative to its own dist/.
          installPhase = ''
            runHook preInstall
            npm prune --omit=dev
            app=$out/libexec/taskgraph
            mkdir -p $app/packages/api $app/packages/web
            cp -r node_modules package.json $app/
            cp -r packages/api/dist packages/api/drizzle packages/api/package.json $app/packages/api/
            # npm creates it only for deps that cannot be hoisted to the root
            if [ -d packages/api/node_modules ]; then
              cp -r packages/api/node_modules $app/packages/api/
            fi
            cp -r packages/web/dist $app/packages/web/
            makeWrapper ${pkgs.nodejs}/bin/node $out/bin/taskgraph \
              --add-flags $app/packages/api/dist/index.js \
              --set NODE_ENV production
            runHook postInstall
          '';
        };
      });

      nixosModules.default = import ./module.nix self;
    };
}
