// src/pages/About.jsx  (or src/About.jsx)
import React from 'react';
import Link from '@mui/material/Link';
import PageTemplate from './PageTemplate'; // Adjust path if needed

function About() {
  return (
    <PageTemplate title="Dashboard"> {/* Set the title */}
      {/* Add your content here */}
      <p>Welcome!</p>
      <p>Below are some resources for Cube building and card lookup. Enjoy!</p>
      <ul>
        <li>
          <Link href="https://www.cubecobra.com" target="_blank" rel="noopener">CubeCobra</Link>
        </li>
        <li>
          <Link href="https://www.scryfall.com" target="_blank" rel="noopener">Scryfall</Link>
        </li>
      </ul>
      {/* More components, text, etc. */}
    </PageTemplate>
  );
}

export default About;
