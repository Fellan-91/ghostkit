/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * External dependencies
 */
import deepAssign from 'deep-assign';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import transforms from './transforms';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Divider', '@@text_domain' ),
    description: __( 'Divide your long texts and blocks.', '@@text_domain' ),
    icon: getIcon( 'block-divider', true ),
    keywords: [
        __( 'divider', '@@text_domain' ),
        __( 'spacer', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/divider/',
        customStylesCallback( attributes ) {
            const styles = {
                '&::before, &::after': {
                    borderColor: attributes.color,
                    borderWidth: attributes.size,
                },
                '.ghostkit-divider-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.iconColor,
                },
            };

            if ( attributes.hoverColor ) {
                styles[ '&:hover' ] = {
                    '&::before, &::after': {
                        borderColor: attributes.hoverColor,
                    },
                };
            }
            if ( attributes.hoverIconColor ) {
                styles[ '&:hover' ] = deepAssign( styles[ '&:hover' ] || {}, {
                    '.ghostkit-divider-icon': {
                        color: attributes.hoverIconColor,
                    },
                } );
            }

            return styles;
        },
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        attributes: {
            size: 4,
            icon: 'fab fa-twitter',
            iconSize: 40,
            color: '#a7a9ab',
            iconColor: '#a7a9ab',
            ghostkitId: 'example-divider',
            ghostkitClassname: 'ghostkit-custom-example-divider',
            className: 'ghostkit-custom-example-divider',
        },
    },
    edit,
    save,
    transforms,
};
