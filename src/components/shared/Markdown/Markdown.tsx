import React, { createElement, PureComponent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import directive from 'remark-directive';
import GithubSlugger from 'github-slugger';

import { importAllImages } from '../../../helpers/import';
import FormCheckboxRadio from '../FormCheckboxRadio/FormCheckboxRadio';

import './Markdown.scss';

type Renderer = {
  name: string;
  children: ReactElement[];
  attributes: RendererItem;
};
type RendererHeading = {
  level: number;
  children: ReactElement[];
  node: RendererItemNode;
};
type RendererLink = {
  href: string;
  children: ReactElement[];
  node: RendererItemNode;
};
type RendererItemPositionDetail = {
  line: number;
  column: number;
  offset: number;
};
type RendererItemPosition = {
  start: RendererItemPositionDetail;
  end: RendererItemPositionDetail;
};
type RendererItemNode = {
  position: RendererItemPosition;
  [key: string]: unknown | unknown[];
};
type RendererItem = {
  children?: ReactElement[];
  checked?: boolean;
  spread?: boolean | string;
  ordered?: boolean | string;
  node: RendererItemNode;
  [key: string]: unknown | unknown[];
};

// We import every images that could be needed by the Markdown component
const imagesFiles = importAllImages();

interface OwnProps {
  content: string;
  dropCap?: boolean;
  fullWidth?: boolean;
  className?: string;
}

type Props = OwnProps;

export class Markdown extends PureComponent<Props, unknown> {

  private slugger = new GithubSlugger();

  transformImageUri = (url: string): string => imagesFiles?.[url]?.default ?? url;

  renderDirective = ({ name, children, attributes }: Renderer): ReactElement => createElement(name, attributes, children);

  renderListItem = ({
    children: originalChildren,
    spread,
    ordered,
    ...attributes
  }: RendererItem): ReactElement => {
    const { renderDirective } = this;
    let children = originalChildren as ReactElement[];
    const { checked, node: { position: { start: { line, column, offset } } } } = attributes;
    if (checked !== null) {
      children = [
        (<FormCheckboxRadio value={checked} key={`${line}-${column}-${offset}`} />),
        ...children,
      ];
    }
    return renderDirective({
      name: 'li',
      children,
      attributes: {
        ...attributes,
        spread: spread?.toString(),
        ordered: ordered?.toString(),
      },
    });
  };

  renderHeading = ({ level, node, children }: RendererHeading): ReactElement => {
    const { slugger, renderDirective } = this;
    const [firstChild] = children;
    return renderDirective({
      name: `h${level}`,
      children,
      attributes: {
        id: slugger.slug(firstChild.props.value),
        node
      },
    });
  };

  renderLink = ({ href, node, children }: RendererLink): ReactElement => {
    const { renderDirective } = this;
    const isAbsolute = (url: string): boolean => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
    const { i18n } = useTranslation();
    const urlMapping: { [key: string]: string } = {
      fr: `//${process.env.REACT_APP_QUORUM_FR_DOMAIN ?? 'projetquorum.com'}`,
      en: `//${process.env.REACT_APP_QUORUM_EN_DOMAIN ?? 'quorumproject.com'}`,
    };
    const currentLang = i18n.language.toLowerCase();
    const newHref = isAbsolute(href) ?  href : `${urlMapping[currentLang]}/${href}`;
    return renderDirective({
      name: 'a',
      children,
      attributes: {
        href: newHref,
        target: '_blank',
        node
      },
    });
  };

  // Go to "/markdown-demo" page to see how to use
  render(): ReactElement {
    const { props, transformImageUri, renderLink, renderHeading, renderListItem, renderDirective } = this;
    const {
      content, dropCap = false, fullWidth = false, className: receivedClassName = '',
    } = props;
    let className = `Markdown ${receivedClassName}`;
    if (dropCap) {
      className = `${className} Markdown-dropcap`;
    }
    if (fullWidth) {
      className = `${className} Markdown-fullwidth`;
    }

    const renderers = {
      link: renderLink,
      heading: renderHeading,
      listItem: renderListItem,
      textDirective: renderDirective,
      containerDirective: renderDirective,
    };
    return (
      <ReactMarkdown
        className={className}
        plugins={[gfm, directive]}
        renderers={renderers}
        transformImageUri={transformImageUri}
      >
        {content}
      </ReactMarkdown>
    );
  }
}

export default Markdown;
