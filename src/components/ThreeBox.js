import React from 'react';

export default function ThreeBox({ box1, box2, box3 }) {
  return (
    <div class="row">
        <div class="three-col">
            <h1>Database</h1>
            <i class="fa fa-database"></i>
            <p>Allows the storing of customers, categories, products and orders.</p>
        </div>
        <div class="three-col">
            <h1>Auto Sync</h1>
            <i class="fa fa-refresh"></i>
            <p>Automatically syncs data throughout the system at the same time.</p>
        </div>
        <div class="three-col">
            <h1>Elegant GUI</h1>
            <i class="fa fa-object-group"></i>
            <p>The user interface provides the user with a simple but refined GUI.</p>
        </div>
    </div>
  );
}