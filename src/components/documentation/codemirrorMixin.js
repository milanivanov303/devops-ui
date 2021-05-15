import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/mode/yaml/yaml';
import _CodeMirror from 'codemirror';

const CodeMirror = window.CodeMirror || _CodeMirror;

export default {
  data() {
    return {
      codeMirror: null,
    };
  },

  methods: {
    initCodeMirror(raml) {
      this.codeMirror = CodeMirror.fromTextArea(
        this.$refs.codemirror,
        {
          tabSize: 4,
          theme: 'mbo',
          mode: 'text/x-yaml',
          lineWrapping: true,
          lineNumbers: true,
          readOnly: 'nocursor',
        }
      );
      this.codeMirror.setSize('100%', '90%');
      this.codeMirror.setValue(raml);
    },
  },
}

