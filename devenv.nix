{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  # https://devenv.sh/basics/
  # env.GREET = "devenv";

  # https://devenv.sh/packages/
  # packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  # Nginx service configuration
  services.nginx = {
    enable = true;
    httpConfig = ''
      server {
        listen 8080;
        server_name localhost;
        location / {
          root ${config.env.DEVENV_ROOT}/public;
          index index.html;
          try_files $uri $uri/ =404;
          add_header Cache-Control 'no-store';
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

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  # enterTest = ''
  #   echo "Running tests"
  #   git --version | grep --color=auto "${pkgs.git.version}"
  # '';
  #
  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
