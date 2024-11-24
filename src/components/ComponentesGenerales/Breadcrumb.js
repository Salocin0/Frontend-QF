import React from 'react';
import PropTypes from 'prop-types';
import useDynamicColors from '../../UseDinamicColors';

const Breadcrumb = ({ items }) => {
  const Colors = useDynamicColors();
  const styles = {
    breadcrumbContainer: {
      margin: '20px 30px',
      backgroundColor: Colors.GrisAzuladoClaro,
      width: '75%',
      padding: '10px 20px',
      borderRadius: '5px',
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
      margin: '0 8px',
      color: Colors.Negro,
    },
  };

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
                <span style={styles.breadcrumbDivider}> {'>'} </span>
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
