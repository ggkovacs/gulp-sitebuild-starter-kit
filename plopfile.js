module.exports = function(plop) {
    'use strict';

    plop.addHelper('upperCaseFirst', function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    plop.setGenerator('page', {
        description: 'Create a page',
        prompts: [{
            type: 'input',
            name: 'pageName',
            message: 'What is page name?',
            validate: function(value) {
                if ((/.+/).test(value)) {
                    return true;
                }

                return 'page name is required';
            }
        }, {
            type: 'input',
            name: 'layoutName',
            message: 'What is layout name?',
            default: 'main'
        }],
        actions: [{
            type: 'add',
            path: 'app/views/{{dashCase pageName}}.swig',
            templateFile: 'templates/view.hbs'
        }]
    });

    plop.setGenerator('component', {
        description: 'Create a (sass) component',
        prompts: [{
            type: 'input',
            name: 'componentName',
            message: 'What is component name?',
            validate: function(value) {
                if ((/.+/).test(value)) {
                    return true;
                }

                return 'component name is required';
            }
        }, {
            type: 'input',
            name: 'directoryName',
            message: 'What is directory name?',
            default: 'components'
        }, {
            type: 'input',
            name: 'ext',
            message: 'What is extensions?',
            default: 'sass',
            validate: function(value) {
                if (value === 'sass' || value === 'scss') {
                    return true;
                }

                return 'extension possible sass or scss';
            }
        }],
        actions: function(data) {
            var actions = [{
                type: 'add',
                path: 'app/styles/{{directoryName}}/_{{dashCase componentName}}.{{lowerCase ext}}'
            }];

            if (data.ext === 'sass') {
                actions[0].templateFile = 'templates/component.sass.hbs';
            } else if (data.ext === 'scss') {
                actions[0].templateFile = 'templates/component.scss.hbs';
            }

            return actions;
        }
    });
};
