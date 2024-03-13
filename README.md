# Shop (Client-Server) .Net Web Api
 Create a REST API to work with Stores (Id, Name, Address) and Sellers (Id, First Name, Last Name, Year of Birth)
o Each salesperson works in exactly one store
o Enable login and registration of users who can perform CRUD operations on Sellers as in the example
o Unlogged user can log in, register and see all sellers in table form (with columns Id, Name and Surname)
o When the user registers, the registration form is cleared and the login form is displayed
o After registration, the following happens:
 The application form is cleared and hidden as well as the buttons for opening the application form and registration
 An expanded tabular view of the Sellers is displayed where, in addition to the existing columns, columns for the Seller's year of birth, the name of the Store and the address of the Store where he works are added.
 As part of the tabular display after the user's login, there is a button to delete the Seller and a button that allows updating the Seller using the form originally used to create
 A form for adding a new Seller appears below the table
• The selection of the Store is made through the drop-down menu (the name of the store is displayed to the user)
• The form has a Cancel button that clears the form and turns it into a seller add form
 The username of the logged in user and the logout button are displayed
• Clicking the logout button destroys the token and returns the page to its original state
o Create a JavaScript client that will consume the REST API
