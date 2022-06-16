// https://vuex.vuejs.org/en/getters.html

export default {
  getVariables: (state) => state.variables,
  getOneVariable: (state) => (payload) => state.variables
    .find((a) => a.name === payload.name && a.inctance_id === payload.inctance_id),
  variableNameIsUnique: (state) => (name) => !state.variables
    .some((a) => a.name === name),
  getRspVariables: (state) => {
    if (state.rspVariables.length > 0) {
      return state.rspVariables.slice().reduce((acc, variable) => {
        const found = acc.find((a) => a.name === variable.name);
        const currentInstance = state.instances
          .find((instance) => instance.id === variable.instance_id);
        if (!found) {
          const newVar = { ...variable };
          newVar[currentInstance.name] = {};
          newVar[currentInstance.name].value = variable.value;
          newVar[currentInstance.name].description = variable.description;
          acc.push(newVar);
        } else {
          if (!found[currentInstance.name]) {
            found[currentInstance.name] = { value: '', description: '' };
          }
          found[currentInstance.name].value = variable.value;
          found[currentInstance.name].description = variable.description;
        }
        return acc;
      }, []);
    }
    return state.rspVariables;
  },
  getOneRspVariable: (state) => (payload) => state.rspVariables
    .find((a) => a.name === payload.name && a.instance_id === payload.instance_id),
  getOneCodixTeam: (state) => (id) => state.codixTeams.find((a) => a.id === id),
  getTemplates: (state) => state.templates.map((template) => {
    template.path_and_name = `${template.source_path}/${template.source_name}`;
    return template;
  }).sort((a, b) => a.path_and_name.localeCompare(b.path_and_name)),
  getInventoryInstances: (state) => (instance) => {
    if (instance) {
      return state.inventoryInstances.filter((e) => e.id !== instance.id);
    }
    return state.inventoryInstances;
  },
  getFilteredVariables: (state) => {
    if (state.firstInstanceVariables.length === 0 || state.secondInstanceVariables.length === 0) {
      return '';
    }
    const resultA = state.firstInstanceVariables.reduce((acc, a) => {
      const found = state.secondInstanceVariables.find((b) => b.name === a.name);
      if (!found) {
        acc.push({
          id: a.id,
          variable_name: a.name,
          [state.firstSelectedInstance.name]:
            `${a.value} <span data-badge-caption="" class="new badge red">${a.made_on}</span>`,
          [state.secondSelectedInstance.name]: 'NOT REGISTERED',
        });
      }
      if (found && found.value !== a.value) {
        acc.push({
          id: a.id,
          variable_name: a.name,
          [state.firstSelectedInstance.name]:
            `${a.value} <span data-badge-caption="" class="new badge red">${a.made_on}</span>`,
          [state.secondSelectedInstance.name]:
            `${found.value} <span data-badge-caption="" class="new badge red">${a.made_on}</span>`,
        });
      }
      return acc;
    }, []);

    const resultB = state.secondInstanceVariables.reduce((acc, a) => {
      if (!state.firstInstanceVariables.some((b) => b.name === a.name)) {
        acc.push({
          id: a.id,
          variable_name: a.name,
          [state.secondSelectedInstance.name]:
            `${a.value} <span data-badge-caption="" class="new badge red">${a.made_on}</span>`,
          [state.firstSelectedInstance.name]: 'NOT REGISTERED',
        });
      }
      return acc;
    }, []);

    const result = [...resultA, ...resultB];

    return Object.values(result.sort((a, b) => a.variable_name.localeCompare(b.variable_name)));
  },
  modules: (state) => state.modules,
  submodules: (state) => state.submodules,
};
