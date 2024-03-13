// podaci od interesa
var host = "https://localhost:";
var port = "44332/";
var sellersEndpoint = "api/sellers/";
var shopsEndpoint = "api/shops/";
var loginEndpoint = "api/authentication/login";
var registerEndpoint = "api/authentication/register";
var formAction = "Create";
var editingId;
var jwt_token;

function loadPage() {
	loadSellers();
}

// prikaz forme za prijavu
function showLogin() {
	document.getElementById("formDiv").style.display = "none";
	document.getElementById("loginFormDiv").style.display = "block";
	document.getElementById("registerFormDiv").style.display = "none";
	document.getElementById("logout").style.display = "none";
}

function validateRegisterForm(username, email, password, confirmPassword) {
	if (username.length === 0) {
		alert("Username field can not be empty.");
		return false;
	} else if (email.length === 0) {
		alert("Email field can not be empty.");
		return false;
	} else if (password.length === 0) {
		alert("Password field can not be empty.");
		return false;
	} else if (confirmPassword.length === 0) {
		alert("Confirm password field can not be empty.");
		return false;
	} else if (password !== confirmPassword) {
		alert("Password value and confirm password value should match.");
		return false;
	}
	return true;
}

function registerUser() {
	var username = document.getElementById("usernameRegister").value;
	var email = document.getElementById("emailRegister").value;
	var password = document.getElementById("passwordRegister").value;
	var confirmPassword = document.getElementById("confirmPasswordRegister").value;

	if (validateRegisterForm(username, email, password, confirmPassword)) {
		var url = host + port + registerEndpoint;
		var sendData = { "Username": username, "Email": email, "Password": password };
		fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) })
			.then((response) => {
				if (response.status === 200) {
					document.getElementById("registerForm").reset();
					console.log("Successful registration");
					alert("Successful registration");
					showLogin();
				} else {
					console.log("Error occured with code " + response.status);
					console.log(response);
					alert("Error occured!");
					response.text().then(text => { console.log(text); })
				}
			})
			.catch(error => console.log(error));
	}
	return false;
}

// prikaz forme za registraciju
function showRegistration() {
	document.getElementById("formDiv").style.display = "none";
	document.getElementById("loginFormDiv").style.display = "none";
	document.getElementById("registerFormDiv").style.display = "block";
	document.getElementById("logout").style.display = "none";
}

function validateLoginForm(username, password) {
	if (username.length === 0) {
		alert("Username field can not be empty.");
		return false;
	} else if (password.length === 0) {
		alert("Password field can not be empty.");
		return false;
	}
	return true;
}

function loginUser() {
	var username = document.getElementById("usernameLogin").value;
	var password = document.getElementById("passwordLogin").value;

	if (validateLoginForm(username, password)) {
		var url = host + port + loginEndpoint;
		var sendData = { "Username": username, "Password": password };
		fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) })
			.then((response) => {
				if (response.status === 200) {
					document.getElementById("loginForm").reset();
					console.log("Successful login");
					alert("Successful login");
					response.json().then(function (data) {
						console.log(data);
						document.getElementById("info").innerHTML = "Currently logged in user: <i>" + data.username + "<i/>.";
						document.getElementById("logout").style.display = "block";
						document.getElementById("btnLogin").style.display = "none";
						document.getElementById("btnRegister").style.display = "none";
						jwt_token = data.token;
						loadSellers();
						loadShopsForDropdown();
					});
				} else {
					console.log("Error occured with code " + response.status);
					console.log(response);
					alert("Error occured!");
					response.text().then(text => { console.log(text); })
				}
			})
			.catch(error => console.log(error));
	}
	return false;
}


// prikaz prodavaca
function loadSellers() {
	document.getElementById("loginFormDiv").style.display = "none";
	document.getElementById("registerFormDiv").style.display = "none";

	// ucitavanje prodavaca
	var requestUrl = host + port + sellersEndpoint;
	console.log("URL zahteva: " + requestUrl);
	var headers = {};
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}
	console.log(headers);
	fetch(requestUrl, { headers: headers })
		.then((response) => {
			if (response.status === 200) {
				response.json().then(setSellers);
			} else {
				console.log("Error occured with code " + response.status);
				showError();
			}
		})
		.catch(error => console.log(error));
}

function showError() {
	var container = document.getElementById("data");
	container.innerHTML = "";

	var div = document.createElement("div");
	var h1 = document.createElement("h1");
	var errorText = document.createTextNode("Error occured while retrieving data!");

	h1.appendChild(errorText);
	div.appendChild(h1);
	container.append(div);
}

// metoda za postavljanje prodavaca u tabelu
function setSellers(data) {
	var container = document.getElementById("data");
	container.innerHTML = "";

	console.log(data);

	// ispis naslova
	var div = document.createElement("div");
	var h1 = document.createElement("h1");
	var headingText = document.createTextNode("Sellers");
	h1.appendChild(headingText);
	div.appendChild(h1);

	// ispis tabele
	var table = document.createElement("table");
	table.className = "table table-hover";

	var header = createHeader();
	table.append(header);

	var tableBody = document.createElement("tbody");

	for (var i = 0; i < data.length; i++) {
		// prikazujemo novi red u tabeli
		var row = document.createElement("tr");
		// prikaz podataka
		row.appendChild(createTableCell(data[i].id));
		row.appendChild(createTableCell(data[i].name + " " + data[i].surname));

		if (jwt_token) {
			row.appendChild(createTableCell(data[i].year));
			row.appendChild(createTableCell(data[i].shopName));
			row.appendChild(createTableCell(data[i].shopAddress));

			// prikaz dugmadi za izmenu i brisanje
			var stringId = data[i].id.toString();

			var buttonEdit = document.createElement("button");
			buttonEdit.name = stringId;
			buttonEdit.addEventListener("click", editSeller);
			buttonEdit.className = "btn btn-warning";
			var buttonEditText = document.createTextNode("Edit");
			buttonEdit.appendChild(buttonEditText);
			var buttonEditCell = document.createElement("td");
			buttonEditCell.appendChild(buttonEdit);
			row.appendChild(buttonEditCell);

			var buttonDelete = document.createElement("button");
			buttonDelete.name = stringId;
			buttonDelete.addEventListener("click", deleteSeller);
			buttonDelete.className = "btn btn-danger";
			var buttonDeleteText = document.createTextNode("Delete");
			buttonDelete.appendChild(buttonDeleteText);
			var buttonDeleteCell = document.createElement("td");
			buttonDeleteCell.appendChild(buttonDelete);
			row.appendChild(buttonDeleteCell);
		}
		tableBody.appendChild(row);
	}

	table.appendChild(tableBody);
	div.appendChild(table);

	// prikaz forme
	if (jwt_token) {
		document.getElementById("formDiv").style.display = "block";
	}
	// ispis novog sadrzaja
	container.appendChild(div);
}

function createHeader() {
	var thead = document.createElement("thead");
	var row = document.createElement("tr");
	
	row.appendChild(createTableHeaderCell("Id"));
	row.appendChild(createTableHeaderCell("Seller"));

	if (jwt_token) {
		row.appendChild(createTableHeaderCell("Year of birth"));
		row.appendChild(createTableHeaderCell("Shop name"));
		row.appendChild(createTableHeaderCell("Shop address"));
		row.appendChild(createTableHeaderCell("Edit"));
		row.appendChild(createTableHeaderCell("Delete"));
	}

	thead.appendChild(row);
	return thead;
}

function createTableHeaderCell(text) {
	var cell = document.createElement("th");
	var cellText = document.createTextNode(text);
	cell.appendChild(cellText);
	return cell;
}

function createTableCell(text) {
	var cell = document.createElement("td");
	var cellText = document.createTextNode(text);
	cell.appendChild(cellText);
	return cell;
}

// prikaz padajuceg menija sa prodavnicama
function loadShopsForDropdown() {
	// ucitavanje prodavnica
	var requestUrl = host + port + shopsEndpoint;
	console.log("URL zahteva: " + requestUrl);

	var headers = {};
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	fetch(requestUrl, {headers: headers})
		.then((response) => {
			if (response.status === 200) {
				response.json().then(setShopsInDropdown);
			} else {
				console.log("Error occured with code " + response.status);
			}
		})
		.catch(error => console.log(error));
};

// metoda za postavljanje podavnica u padajuci meni
function setShopsInDropdown(data) {
	var dropdown = document.getElementById("sellerShop");
	dropdown.innerHTML = "";
	for (var i = 0; i < data.length; i++) {
		var option = document.createElement("option");
		option.value = data[i].id;
		var text = document.createTextNode(data[i].name);
		option.appendChild(text);
		dropdown.appendChild(option);
	}
}

// dodavanje novog prodavca
function submitSellerForm() {

	var sellerName = document.getElementById("sellerName").value;
	var sellerSurname = document.getElementById("sellerSurname").value;
	var sellerYear = document.getElementById("sellerYear").value;
	var sellerShop = document.getElementById("sellerShop").value;
	var httpAction;
	var sendData;
	var url;

	// u zavisnosti od akcije pripremam objekat
	if (formAction === "Create") {
		httpAction = "POST";
		url = host + port + sellersEndpoint;
		sendData = {
			"Name": sellerName,
			"Surname": sellerSurname,
			"Year": sellerYear,
			"ShopId": sellerShop
		};
	}
	else {
		httpAction = "PUT";
		url = host + port + sellersEndpoint + editingId.toString();
		sendData = {
			"Id": editingId,
			"Name": sellerName,
			"Surname": sellerSurname,
			"Year": sellerYear,
			"ShopId": sellerShop
		};
	}

	console.log("Objekat za slanje");
	console.log(sendData);
	var headers = { 'Content-Type': 'application/json' };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}
	fetch(url, { method: httpAction, headers: headers, body: JSON.stringify(sendData) })
		.then((response) => {
			if (response.status === 200 || response.status === 201) {
				console.log("Successful action");
				formAction = "Create";
				refreshTable();
			} else {
				console.log("Error occured with code " + response.status);
				alert("Error occured!");
			}
		})
		.catch(error => console.log(error));
	return false;
}

// brisanje prodavca
function deleteSeller() {
	// izvlacimo {id}
	var deleteID = this.name;
	// saljemo zahtev 
	var url = host + port + sellersEndpoint + deleteID.toString();
	var headers = { 'Content-Type': 'application/json' };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	fetch(url, { method: "DELETE", headers: headers})
		.then((response) => {
			if (response.status === 204) {
				console.log("Successful action");
				refreshTable();
			} else {
				console.log("Error occured with code " + response.status);
				alert("Error occured!");
			}
		})
		.catch(error => console.log(error));
};

// izmena prodavca
function editSeller() {
	// izvlacimo id
	var editId = this.name;
	// saljemo zahtev da dobavimo tog prodavca

	var url = host + port + sellersEndpoint + editId.toString();
	var headers = { };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	fetch(url, { headers: headers})
		.then((response) => {
			if (response.status === 200) {
				console.log("Successful action");
				response.json().then(data => {
					document.getElementById("sellerName").value = data.name;
					document.getElementById("sellerSurname").value = data.surname;
					document.getElementById("sellerYear").value = data.year;
					document.getElementById("sellerShop").value = data.shopId;
					editingId = data.id;
					formAction = "Update";
				});
			} else {
				formAction = "Create";
				console.log("Error occured with code " + response.status);
				alert("Error occured!");
			}
		})
		.catch(error => console.log(error));
};

// osvezi prikaz tabele
function refreshTable() {
	// cistim formu
	document.getElementById("sellerForm").reset();
	// osvezavam
	loadSellers();
};

function logout() {
	jwt_token = undefined;
	document.getElementById("info").innerHTML = "";
	document.getElementById("data").innerHTML = "";
	document.getElementById("formDiv").style.display = "none";
	document.getElementById("loginFormDiv").style.display = "block";
	document.getElementById("registerFormDiv").style.display = "none";
	document.getElementById("logout").style.display = "none";
	document.getElementById("btnLogin").style.display = "initial";
	document.getElementById("btnRegister").style.display = "initial";
	loadSellers();
}

function cancelSellerForm() {
	formAction = "Create";
}