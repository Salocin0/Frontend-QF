import React from 'react';
import PropTypes from 'prop-types';
import useBreakpoint from '../../useBreakpoint';

const Breadcrumb = ({ items, style }) => {
  const { isMobile } = useBreakpoint();

  let styles = {
    breadcrumbContainer: {
      margin: isMobile ? '4px auto' : '8px auto',
      backgroundColor: 'var(--qf-bg-secondary)',
      width: isMobile ? '100%' : '98%',
      padding: isMobile ? '6px 10px' : '8px 16px',
      marginBottom: '10px',
      marginTop: '0px',
      borderRadius: '10px',
      border: '1px solid var(--qf-naranja)',
      boxSizing: 'border-box',
    },
    breadcrumb: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexWrap: 'wrap',
    },
    breadcrumbItem: {
      fontSize: isMobile ? '12px' : '14px',
      color: 'var(--qf-naranja)',
      whiteSpace: 'nowrap',
    },
    breadcrumbItemLink: {
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
    },
    breadcrumbItemActive: {
      color: 'var(--qf-text-white)',
    },
    breadcrumbDivider: {
      margin: isMobile ? '0 4px' : '0 10px',
      color: 'var(--qf-text-white)',
    },
  };

  if (style) {
    styles = {
      ...styles,
      breadcrumbContainer: {
        ...styles.breadcrumbContainer,
        ...style,
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
