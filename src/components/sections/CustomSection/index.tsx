import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';

import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Action, Badge } from '../../atoms';

export default function CustomSection(props) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, text, actions = [], media, styles = {}, enableAnnotations } = props;
    const flexDirection = styles?.self?.flexDirection ?? 'row';
    const alignItems = styles?.self?.alignItems ?? 'flex-start';
    const hasTextContent = !!(badge?.url || title?.text || subtitle || text || actions.length > 0);
    const hasMedia = !!(media && (media?.url || (media?.fields ?? []).length > 0));
    const hasXDirection = flexDirection === 'row' || flexDirection === 'row-reverse';

    return (
        <Section
            elementId={elementId}
            className="sb-component-custom-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
            {...getDataAttrs(props)}
        >
            <div
                className={classNames(
                    'w-full',
                    'flex',
                    mapFlexDirectionStyles(flexDirection, hasTextContent, hasMedia),
                    /* handle horizontal positioning of content on small screens or when direction is col or col-reverse, mapping justifyContent to alignItems instead since it's a flex column */
                    mapStyles({ alignItems: styles?.self?.justifyContent ?? 'flex-start' }),
                    /* handle vertical positioning of content on large screens if it's a two col layout */
                    hasMedia && hasTextContent && hasXDirection ? mapAlignItemsStyles(alignItems) : undefined,
                    'gap-x-12',
                    'gap-y-16'
                )}
            >
                {hasTextContent && (
                    <div
                        className={classNames('w-full', 'max-w-sectionBody', {
                            'lg:max-w-[27.5rem]': hasMedia && hasXDirection
                        })}
                    >
                        {badge && <Badge {...badge} {...(enableAnnotations && { 'data-sb-field-path': '.badge' })} />}
                        {title && (
                            <TitleBlock
                                {...title}
                                className={classNames({ 'mt-4': badge?.label })}
                                {...(enableAnnotations && { 'data-sb-field-path': '.title' })}
                            />
                        )}
                        {subtitle && (
                            <p
                                className={classNames('text-lg', 'sm:text-2xl', styles?.subtitle ? mapStyles(styles?.subtitle) : undefined, {
                                    'mt-4': badge?.label || title?.text
                                })}
                                {...(enableAnnotations && { 'data-sb-field-path': '.subtitle' })}
                            >
                                {subtitle}
                            </p>
                        )}
                        {<div>
                    <iframe 
                        src="https://embeds.beehiiv.com/752cd0b3-70d4-4b93-a7bf-b5c0050bbc1f"
                        data-test-id="beehiiv-embed" 
                        width="100%" 
                        height="320"
                        frameBorder="0" 
                        scrolling="no" 
                        style={{
                            borderRadius: '4px',
                            border: '2px solid #e5e7eb',
                            margin: 0,
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>}
                        {actions.length > 0 && (
                            <div
                                className={classNames(
                                    'flex',
                                    'flex-wrap',
                                    mapStyles({ justifyContent: styles?.self?.justifyContent ?? 'flex-start' }),
                                    'items-center',
                                    'gap-4',
                                    {
                                        'mt-8': badge?.label || title?.text || subtitle || text
                                    }
                                )}
                                {...(enableAnnotations && { 'data-sb-field-path': '.actions' })}
                            >
                                {actions.map((action, index) => (
                                    <Action
                                        key={index}
                                        {...action}
                                        className="lg:whitespace-nowrap"
                                        {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
}

function Media({ media, hasAnnotations }: { media: any; hasAnnotations: boolean }) {
    const modelName = media.__metadata.modelName;
    if (!modelName) {
        throw new Error(`generic section media does not have the 'modelName' property`);
    }
    const MediaComponent = getComponent(modelName);
    if (!MediaComponent) {
        throw new Error(`no component matching the hero section media model name: ${modelName}`);
    }
    return <MediaComponent {...media} {...(hasAnnotations && { 'data-sb-field-path': '.media' })} />;
}

function mapFlexDirectionStyles(flexDirection: string, hasTextContent: boolean, hasMedia: boolean) {
    switch (flexDirection) {
        case 'row':
            return hasTextContent && hasMedia ? 'flex-col lg:flex-row lg:justify-between' : 'flex-col';
        case 'row-reverse':
            return hasTextContent && hasMedia ? 'flex-col lg:flex-row-reverse lg:justify-between' : 'flex-col';
        case 'col':
            return 'flex-col';
        case 'col-reverse':
            return 'flex-col-reverse';
        default:
            return null;
    }
}

function mapAlignItemsStyles(alignItems: string) {
    switch (alignItems) {
        case 'flex-start':
            return 'lg:items-start';
        case 'flex-end':
            return 'lg:items-end';
        case 'center':
            return 'lg:items-center';
        default:
            return null;
    }
}
