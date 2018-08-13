// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/gist.svg';
import GistFilesSelect from './file-select.jsx';

const { GHOSTKIT, jQuery } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    Placeholder,
} = wp.components;

const {
    InspectorControls,
} = wp.editor;

class GistBlock extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            url: '',
        };

        this.onUpdate = this.onUpdate.bind( this );
        this.urlOnChange = this.urlOnChange.bind( this );
    }

    componentDidMount() {
        this.setState( { url: this.props.attributes.url } );
        this.onUpdate();
    }
    componentDidUpdate() {
        this.onUpdate();
    }

    onUpdate() {
        const {
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = this.props.attributes;

        if ( ! url || ! this.gistNode ) {
            return;
        }

        if ( typeof jQuery.fn.gist === 'undefined' ) {
            // eslint-disable-next-line
            console.warn( __( 'Gist Embed plugin is not defined.' ) );
            return;
        }

        // cache request to prevent reloading.
        const cachedRequest = url + file + caption + ( showFooter ? 1 : 0 ) + ( showLineNumbers ? 1 : 0 );
        if ( cachedRequest === this.cachedRequest ) {
            return;
        }
        this.cachedRequest = cachedRequest;

        setTimeout( () => {
            const $gist = jQuery( this.gistNode );

            const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec( url );

            if ( match && typeof match[ 1 ] !== 'undefined' ) {
                $gist.data( 'gist-id', match[ 1 ] );
                $gist.data( 'gist-file', file );
                $gist.data( 'gist-caption', caption );
                $gist.data( 'gist-hide-footer', ! showFooter );
                $gist.data( 'gist-hide-line-numbers', ! showLineNumbers );
                $gist.data( 'gist-show-spinner', true );
                $gist.data( 'gist-enable-cache', true );

                $gist.gist();
            }
        }, 0 );
    }

    urlOnChange( value, timeout = 1000 ) {
        this.setState( { url: value } );

        clearTimeout( this.urlTimeout );

        this.urlTimeout = setTimeout( () => {
            this.props.setAttributes( { url: value } );
        }, timeout );
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'gist' );

        className = classnames( 'ghostkit-gist', className );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }

                        <TextControl
                            label={ __( 'URL' ) }
                            value={ this.state.url }
                            onChange={ this.urlOnChange }
                            onKeyDown={ ( e ) => {
                                if ( e.keyCode === 13 ) {
                                    this.urlOnChange( this.state.url, 0 );
                                }
                            } }
                        />

                        <GistFilesSelect
                            label={ __( 'File' ) }
                            url={ url }
                            value={ file }
                            onChange={ ( value ) => setAttributes( { file: value } ) }
                        />

                        <TextControl
                            label={ __( 'Caption' ) }
                            value={ caption }
                            onChange={ ( value ) => setAttributes( { caption: value } ) }
                        />

                        <ToggleControl
                            label={ __( 'Show footer' ) }
                            checked={ !! showFooter }
                            onChange={ ( val ) => setAttributes( { showFooter: val } ) }
                        />

                        <ToggleControl
                            label={ __( 'Show line numbers' ) }
                            checked={ !! showLineNumbers }
                            onChange={ ( val ) => setAttributes( { showLineNumbers: val } ) }
                        />
                    </PanelBody>
                </InspectorControls>

                <div>
                    { ! url ? (
                        <Placeholder
                            icon={ <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" /> }
                            label={ __( 'Gist URL' ) }
                            className={ className }
                        >
                            <TextControl
                                placeholder={ __( 'https://gist.github.com/...' ) }
                                value={ this.state.url }
                                onChange={ this.urlOnChange }
                                onKeyDown={ ( e ) => {
                                    if ( e.keyCode === 13 ) {
                                        this.urlOnChange( this.state.url, 0 );
                                    }
                                } }
                            />
                            <a href="https://gist.github.com/" target="_blank" rel="noopener noreferrer">{ __( 'Visit GitHub Gist site' ) }</a>
                        </Placeholder>
                    ) : '' }
                    { url ? (
                        <div
                            ref={ gistNode => this.gistNode = gistNode }
                            className={ className }
                            data-url={ url }
                            data-file={ file }
                            data-caption={ caption }
                            data-show-footer={ showFooter ? 'true' : 'false' }
                            data-show-line-numbers={ showLineNumbers ? 'true' : 'false' }
                        />
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/gist';

export const settings = {
    title: __( 'GitHub Gist' ),
    description: __( 'GitHub Gist embed.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'ghostkit',
    keywords: [
        __( 'github' ),
        __( 'gist' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        url: {
            type: 'string',
            default: '',
        },
        file: {
            type: 'string',
            default: '',
        },
        caption: {
            type: 'string',
            default: '',
        },
        showFooter: {
            type: 'boolean',
            default: true,
        },
        showLineNumbers: {
            type: 'boolean',
            default: true,
        },
    },

    edit: GistBlock,

    save: function( { attributes, className = '' } ) {
        const {
            variant,
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = attributes;

        className = classnames( 'ghostkit-gist', className );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-gist-variant-${ variant }` );
        }

        return (
            <div className={ className } data-url={ url } data-file={ file } data-caption={ caption } data-show-footer={ showFooter ? 'true' : 'false' } data-show-line-numbers={ showLineNumbers ? 'true' : 'false' } />
        );
    },
};
