import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme.js';

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
	plugins: [typography, daisyui],
	daisyui: {
		themes: ['lemonade', 'dracula'],
		darkTheme: 'dracula'
	}
};
