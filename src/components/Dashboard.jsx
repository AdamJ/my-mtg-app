// src/pages/About.jsx  (or src/About.jsx)
import React from 'react';
import Link from '@mui/material/Link';
import PageTemplate from '../components/templates/PageTemplate'; // Adjust path if needed

function About() {

  const myspace = import.meta.env.MODE;

  return (
    <PageTemplate title="Dashboard"> {/* Set the title */}
      {/* Add your content here */}
      <p>Welcome!</p>
      <p>Included are some resources for Cube building and card lookup. Enjoy!</p>
      <h2>Vite is running in {myspace}</h2>
      <ul>
        <li>
          <Link href="https://www.cubecobra.com" target="_blank" rel="noopener" aria-label="External link to CubeCobra">CubeCobra (external link)</Link>
        </li>
        <li>
          <Link href="https://www.scryfall.com" target="_blank" rel="noopener" aria-label="External link to Scryfall">Scryfall (external link)</Link>
        </li>
      </ul>
      {/* More components, text, etc. */}
    </PageTemplate>
  );
}

export default About;
