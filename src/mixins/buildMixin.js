export const buildMixin = {
  methods: {
    getPublishedPort(build, port) {
      try {
        return build.details.service.Endpoint.Ports
          .find(value => value.TargetPort === port).PublishedPort;
      } catch (e) {
        return null;
      }
    },

    getUrl(build) {
      const { host } = this.$store.state[build.module];
      try {
        let port;
        try {
          port = build.details.container.NetworkSettings.Ports['8080/tcp'][0].HostPort;
          return `http://${host}:${port}/${this.getName(build)}/`;
        } catch (e) {
          port = build.details.container.NetworkSettings.Ports['8591/tcp'][0].HostPort;
          return `http://${host}:${port}/${this.getName(build)}/`;
        }
      } catch (e) {
        const port = this.getPublishedPort(build, 8080);
        if (port) {
          return `http://${host}:${port}/${this.getName(build)}/`;
        }
        return null;
      }
    },

    getName(build) {
      try {
        return build.details.container.Config.Labels.build;
      } catch (e) {
        if (build.details.service) {
          return build.details.service.Spec.TaskTemplate.ContainerSpec.Env.reduce((env) => {
            if (env.match(/^EXTRANET_BUILD_DIR=/)) {
              return env.split('=').slice(-1).toString().split('/')
                .slice(-1)
                .toString();
            }
            return 'could-not-get-build-name';
          });
        }
        return 'could-not-get-build-name';
      }
    },
  }
};
