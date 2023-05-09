import React from 'react';
import ProjectPage from '../ProjectPage';

export default function StockAssistPage() {
	return (
		<ProjectPage
		project = {{ 
			name: "StockAssist",
			title: "Inventory Management System",
			description: <p>StockAssist is a small-scale inventory management system that improves productivity by keeping track of a small business' customers, categories, products and orders.
			However, this product does much more than that.<br/><br/>
			It also automatically keeps track of inventory counts, calculates totals, and dynamically changes information across the system at once.<br/><br/>
			This means that changing the name of a customer will immediately show up on all of their orders and any modifications made to a certain product will be reflected in
			any outstanding order as well. This saves the user a substantial amount of time and effort.<br/><br/>
			This system also allows multiple users in which their data is stored completely separately between them.</p>
		}}
		overview = {{
			box1: {
			title: "Database",
			icon: "database",
			description: "Allows the storing of customers, categories, products and orders."
			},
			box2: {
			title: "Auto Sync",
			icon: "refresh",
			description: "Automatically syncs data throughout the system at the same time."
			},
			box3: {
			title: "Elegant GUI",
			icon: "object-group",
			description: "The user interface provides the user with a simple but refined GUI."
			}
		}}
		languages = {{
			languageCount: 1,
			l1: {
			name: "Java",
			icon: "Java.png",
			percent: "100"
			}
		}}
		gallery = {{
			image1: {
			title: "Login Page",
			path: "Inventory Manager/Login.png",
			description: `The login page of the program. This is where users are able to login with an existing account,
				given they have the right username and password, or create a new account with a unique username and their password of choice.`
			},
			image2: {
			title: "Home Screen",
			path: "Inventory Manager/Home.png",
			description: `The user's dashboard. This is the hub which allows the user to access all parts of the program.`
			},
			image3: {
			title: "User List (Admin)",
			path: "Inventory Manager/Users.png",
			description: `This page allows the administrator to view, add, edit, delete and organize users.`
			},
			image4: {
			title: "Customers Panel",
			path: "Inventory Manager/Customers.png",
			description: `This panel allows the user to view, add, edit, remove and organize their customers.
			Customers contain contact information and can be associated to orders.`
			},
			image5: {
			title: "Categories Panel",
			path: "Inventory Manager/Categories.png",
			description: `This panel allows the user to organize their products with categories that they may create, edit, remove and organize at any point.`
			},
			image6: {
			title: "Products Panel",
			path: "Inventory Manager/Products.png",
			description: `This panel allows the user to create products with binding information such as its price and its category.
			This is also where product stock is kept track of.`
			},
			image7: {
			title: "Order Tables",
			path: "Inventory Manager/Orders.png",
			description: `These are the order tables. The top table shows the user the list of current orders with information such as the customer and price of the order.
			The bottom table shows the products inside the order selected from the top table. This allows the user to easily view all order information at a glance.`
			},
			image8: {
			title: "Create Order Screen",
			path: "Inventory Manager/New Order.png",
			description: `This page is where the user makes a new order. The user must simply select a customer from their list and then add the products to the order.
			As the user is adding products to the order, the system will automatically keep track of the remaining inventory of products and the order total.`
			}
		}}
		github = {{
			repository: "inventory-system"
		}}
		/>
	);
}