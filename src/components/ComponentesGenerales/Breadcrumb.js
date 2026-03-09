import React from 'react';
import PropTypes from 'prop-types';
import useDynamicColors from '../../UseDinamicColors';

const Breadcrumb = ({ items, style }) => {
  const Colors = useDynamicColors();
  let styles ={
    breadcrumbContainer: {
      margin: '8px auto',
      backgroundColor: Colors.GrisAzuladoClaro,
      width: '98%',
      padding: '8px 16px',
      marginBottom: '10px',
      marginTop: '0px',
      borderRadius: '10px',
      border: `1px solid ${Colors.Naranja}`,
    },
    breadcrumb: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
    },
    breadcrumbItem: {
      fontSize: '14px',
      color: Colors.Naranja,
    },
    breadcrumbItemLink: {
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
    },
    breadcrumbItemActive: {
      color: Colors.Negro,
    },
    breadcrumbDivider: {
      content: "'>'",
      margin: '0 10px',
      color: Colors.Negro,
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
