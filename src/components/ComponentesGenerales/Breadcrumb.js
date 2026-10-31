import React from 'react';
import PropTypes from 'prop-types';
import useBreakpoint from '../../useBreakpoint';

const Breadcrumb = ({ items, style }) => {
  const { isMobile } = useBreakpoint();

  let styles = {
    breadcrumbContainer: {
      margin: '0 0 20px',
      backgroundColor: 'transparent',
      width: '100%',
      padding: '8px 0',
      marginBottom: '20px',
      marginTop: '0px',
      borderRadius: 0,
      border: 'none',
      boxSizing: 'border-box',
    },
    breadcrumb: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      rowGap: '8px',
    },
    breadcrumbItem: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 600,
      lineHeight: 1.5,
      color: 'var(--qf-naranja)',
      whiteSpace: 'nowrap',
    },
    breadcrumbItemLink: {
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
    },
    breadcrumbItemActive: {
      color: 'var(--qf-highlight-text)',
      fontWeight: 800,
    },
    breadcrumbDivider: {
      margin: isMobile ? '0 4px' : '0 10px',
      color: 'var(--qf-text-muted)',
      fontWeight: 400,
    },
  };

  if (style) {
    styles = {
      ...styles,
      breadcrumbContainer: {
        ...styles.breadcrumbContainer,
        ...style,
        width: '100%',
        margin: '0 0 20px',
        padding: '8px 0',
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
      },
    };
  }

  return (
    <nav style={styles.breadcrumbContainer} aria-label="breadcrumb">
      <ol style={styles.breadcrumb}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              ...styles.breadcrumbItem,
              ...(index === items.length - 1 ? styles.breadcrumbItemActive : {}),
            }}
            aria-current={index === items.length - 1 ? 'page' : undefined}
          >
            {index === items.length - 1 ? (
              item.title
            ) : (
              <>
                <a href={item.url} style={styles.breadcrumbItemLink}>
                  {item.title}
                </a>
                <span style={styles.breadcrumbDivider}>{'>'}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Breadcrumb;
