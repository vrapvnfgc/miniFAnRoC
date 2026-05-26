import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import path from 'node:path';

const architecturePlugin = {
	rules: {
		'match-module-filename': {
			meta: {
				type: 'suggestion',
				docs: {
					description: 'Enforce that files inside modules match the module name prefix.'
				},
				schema: []
			},
			create(context) {
				const filePath = context.filename.replace(/\\/g, '/');
				if (filePath.includes('/src/modules/')) {
					const relativePath = filePath.split('/src/modules/')[1];
					const pathSegments = relativePath.split('/');
					if (pathSegments.length >= 2) {
						const moduleName = pathSegments[0];
						const fileName = pathSegments[pathSegments.length - 1];

						if (fileName !== 'index.ts' && !fileName.startsWith(`${moduleName}.`)) {
							return {
								Program(node) {
									context.report({
										node,
										message: `File '${fileName}' in module '${moduleName}' must start with the module name prefix '${moduleName}.' (e.g. '${moduleName}.service.ts').`
									});
								}
							};
						}
					}
				}
				return {};
			}
		},
		'restrict-cross-module-imports': {
			meta: {
				type: 'suggestion',
				docs: {
					description: 'Enforce that cross-module imports are restricted to services.'
				},
				schema: []
			},
			create(context) {
				const filePath = context.filename.replace(/\\/g, '/');
				if (!filePath.includes('/src/modules/')) {
					return {};
				}

				const currentModuleMatch = filePath.match(/\/src\/modules\/([^/]+)/);
				if (!currentModuleMatch) {
					return {};
				}
				const currentModule = currentModuleMatch[1];
				const currentDir = path.dirname(filePath);

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;
						// Only check relative imports
						if (!importPath.startsWith('.')) {
							return;
						}

						const resolvedPath = path.resolve(currentDir, importPath).replace(/\\/g, '/');
						if (!resolvedPath.includes('/src/modules/')) {
							return;
						}

						const importedModuleMatch = resolvedPath.match(/\/src\/modules\/([^/]+)/);
						if (!importedModuleMatch) {
							return;
						}

						const importedModule = importedModuleMatch[1];
						if (currentModule !== importedModule) {
							const importedFileName = path.basename(resolvedPath);
							
							const allowedPattern = new RegExp(`^${importedModule}\\.service(?:\\.ts)?$`);
							if (!allowedPattern.test(importedFileName)) {
								context.report({
									node,
									message: `Cross-module import violation: Module '${currentModule}' is importing '${importedFileName}' from module '${importedModule}'. Modules should only communicate via their services (e.g. '${importedModule}.service.ts').`
								});
							}
						}
					}
				};
			}
		}
	}
};

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	{
		ignores: ['dist/**']
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2022
			}
		}
	},
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			architecture: architecturePlugin
		},
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'architecture/match-module-filename': 'error',
			'architecture/restrict-cross-module-imports': 'error'
		}
	}
);
