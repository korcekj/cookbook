const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Rubik Variable', ...defaultTheme.fontFamily.sans]
			},
			typography: {
				DEFAULT: {
					css: {
						'max-width': 'none',
						h2: {
							marginTop: '0'
						},
						h3: {
							marginTop: '0'
						},
						h4: {
							marginTop: '0'
						}
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: ['lemonade', 'dracula'],
		darkTheme: 'dracula'
	}
};
