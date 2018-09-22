/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const classNames = require('classnames');
const path = require('path');
const React = require('react');
const url = require('url');

const Container = require('./Container.js');
const Doc = require('./Doc.js');
const DocsSidebar = require('./DocsSidebar.js');
const OnPageNav = require('./nav/OnPageNav.js');
const Site = require('./Site.js');
const translation = require('../server/translation.js');
const docs = require('../server/docs.js');
const {idx, getGitLastUpdated} = require('./utils.js');

// component used to generate whole webpage for docs, including sidebar/header/footer
class DocsLayout extends React.Component {
  getRelativeURL = (from, to) => {
    const extension = this.props.config.cleanUrl ? '' : '.html';
    const relativeHref =
      path
        .relative(from, to)
        .replace('\\', '/')
        .replace(/^\.\.\//, '') + extension;
    return url.resolve(
      `${this.props.config.baseUrl}${this.props.metadata.permalink}`,
      relativeHref,
    );
  };

  render() {
    const metadata = this.props.metadata;
    const content = this.props.children;
    const i18n = translation[metadata.language];
    const id = metadata.localized_id;
    const defaultTitle = metadata.title;
    let DocComponent = Doc;
    if (this.props.Doc) {
      DocComponent = this.props.Doc;
    }
    let updateTime;
    if (this.props.config.enableUpdateTime) {
      const filepath = docs.getFilePath(metadata);
      updateTime = getGitLastUpdated(filepath);
    }

    const title =
      idx(i18n, ['localized-strings', 'docs', id, 'title']) || defaultTitle;
    const hasOnPageNav = this.props.config.onPageNav === 'separate';

    const previousTitle =
      idx(i18n, ['localized-strings', metadata.previous_id]) ||
      idx(i18n, ['localized-strings', 'previous']) ||
      metadata.previous_title ||
      'Previous';
    const nextTitle =
      idx(i18n, ['localized-strings', metadata.next_id]) ||
      idx(i18n, ['localized-strings', 'next']) ||
      metadata.next_title ||
      'Next';

    return (
      <Site
        config={this.props.config}
        className={classNames('sideNavVisible', {
          separateOnPageNav: hasOnPageNav,
        })}
        title={title}
        description={content.trim().split('\n')[0]}
        language={metadata.language}
        version={metadata.version}
        metadata={metadata}>
        <div className="docMainWrapper wrapper">
          <DocsSidebar metadata={metadata} />
          <Container className="mainContainer docMainContainer">
            <DocComponent
              metadata={metadata}
              content={content}
              config={this.props.config}
              source={metadata.source}
              hideTitle={metadata.hide_title}
              title={title}
              version={metadata.version}
              language={metadata.language}
            />
            <div className="docs-prevnext">
              {metadata.previous_id && (
                <a
                  className="docs-prev button"
                  href={this.getRelativeURL(
                    metadata.localized_id,
                    metadata.previous_id,
                  )}>
                  <span className="arrow-prev">← </span>
                  <span
                    className={
                      previousTitle.match(/[a-z][A-Z]/) &&
                      'function-name-prevnext'
                    }>
                    {previousTitle}
                  </span>
                </a>
              )}
              {metadata.next_id && (
                <a
                  className="docs-next button"
                  href={this.getRelativeURL(
                    metadata.localized_id,
                    metadata.next_id,
                  )}>
                  <span
                    className={
                      nextTitle.match(/[a-z][A-Z]/) && 'function-name-prevnext'
                    }>
                    {nextTitle}
                  </span>
                  <span className="arrow-next"> →</span>
                </a>
              )}
            </div>
            {this.props.config.enableUpdateTime &&
              updateTime && (
                <p style={{fontSize: '12px', textAlign: 'right'}}>
                  <strong>Last updated: </strong>
                  {updateTime}
                </p>
              )}
          </Container>
          {hasOnPageNav && (
            <nav className="onPageNav docOnPageNav">
              <OnPageNav rawContent={content} />
            </nav>
          )}
        </div>
      </Site>
    );
  }
}
module.exports = DocsLayout;
