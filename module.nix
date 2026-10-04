self:
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.taskgraph;
  inherit (pkgs.stdenv.hostPlatform) system;
in
{
  options.services.taskgraph = {
    enable = lib.mkEnableOption "the TaskGraph server";

    port = lib.mkOption {
      type = lib.types.port;
      description = "Port the server listens on, for the reverse proxy in front of it.";
    };

    environmentFile = lib.mkOption {
      type = lib.types.nullOr lib.types.path;
      default = null;
      description = "File with `GITHUB_TOKEN=...`, a read-only token for showing the pull request state of linked tasks.";
    };
  };

  config = lib.mkIf cfg.enable {
    users.users.taskgraph = {
      isSystemUser = true;
      group = "taskgraph";
    };

    users.groups.taskgraph = { };

    # Peer authentication over the socket matches the system user to the role,
    # and ensureDBOwnership only grants a role its same-named database.
    services.postgresql = {
      enable = true;
      ensureDatabases = [ "taskgraph" ];
      ensureUsers = [
        {
          name = "taskgraph";
          ensureDBOwnership = true;
        }
      ];
    };

    systemd.services.taskgraph = {
      description = "TaskGraph server";
      wantedBy = [ "multi-user.target" ];
      after = [
        "network.target"
        "postgresql.service"
      ];
      requires = [ "postgresql.service" ];

      environment = {
        DATABASE_URL = "postgresql://taskgraph@/taskgraph?host=/run/postgresql";
        PORT = toString cfg.port;
      };

      serviceConfig = {
        ExecStart = lib.getExe' self.packages.${system}.default "taskgraph";
        User = "taskgraph";
        Group = "taskgraph";
        Restart = "on-failure";
        EnvironmentFile = lib.mkIf (cfg.environmentFile != null) cfg.environmentFile;
      };
    };
  };
}
