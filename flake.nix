{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    devenv.url = "github:cachix/devenv";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    inputs@{
      flake-parts,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.devenv.flakeModule
      ];
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
      perSystem =
        {
          ...
        }:
        {
          devenv.shells.default = {
            # Nginx service configuration
            services.nginx = {
              enable = true;
              httpConfig = ''
                server {
                  listen 8080;
                  server_name localhost;

                  location / {
                    root ${./public};
                    index index.html;
                    try_files $uri $uri/ =404;
                  }
                }
              '';
            };

            # Shell hook to provide instructions
            enterShell = ''
              echo "🚀 Development environment ready!"
              echo "📁 Place your web files in ./public/"
              echo "🌐 Nginx will serve on http://localhost:8080"
              echo "🔗 Use 'tailscale serve' to share on your tailnet"
            '';
          };
        };
    };
}
