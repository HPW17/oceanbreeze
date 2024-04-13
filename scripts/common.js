
/*******************************************************************
 * initial date setting 
 *******************************************************************/
const month_name = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const month_full = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday_name = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const weekday_full = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const now = new Date();
let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
let date1, date2, adults, kids;
let clickTime = 0; // 0 for choosing start date, 1 for choosing end date

// set initial from_date = today, to_date = tomorrow
if (sessionStorage.getItem("date1") == null) {
	date1 = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
	date2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1); 
	d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // temp from
	d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1); // temp to
	sessionStorage.setItem("date1", date1.toString());
	sessionStorage.setItem("date2", date2.toString());
}
else {
	date1 = new Date(sessionStorage.getItem("date1"));
	date2 = new Date(sessionStorage.getItem("date2"));
	d1 = new Date(sessionStorage.getItem("date1"));
	d2 = new Date(sessionStorage.getItem("date2"));
}
// set initial adults = 1, kids = 0
if (sessionStorage.getItem("adults") == null) {
	adults = 1;
	kids = 0;
	temp_a = 1; // temp adults
	temp_k = 0; // temp kids
	sessionStorage.setItem("adults", adults);
	sessionStorage.setItem("kids", kids);
}
else {
	adults = sessionStorage.getItem("adults");
	kids = sessionStorage.getItem("kids");
	temp_a = sessionStorage.getItem("adults"); 
	temp_k = sessionStorage.getItem("kids"); 
}	


// show initial dates in date picker on page
window.onload = updateBookNumbers();
function updateBookNumbers() {
	document.getElementById("from_date").innerText = date1.getDate();
	document.getElementById("from_month").innerText = month_name[date1.getMonth()];
	document.getElementById("from_weekday").innerText = weekday_name[date1.getDay()];
	document.getElementById("to_date").innerText = date2.getDate();
	document.getElementById("to_month").innerText = month_name[date2.getMonth()];
	document.getElementById("to_weekday").innerText = weekday_name[date2.getDay()];
	document.getElementById("num_adults").innerText = adults;
	document.getElementById("num_kids").innerText = kids;
	if (adults != 1) {
		document.getElementById("plural_adults").innerText = "s";
	}
	if (kids != 1) {
		document.getElementById("plural_kids").innerText = "s";
	}
}


/*******************************************************************
 * expand mobile menu when hamburger onclick
 *******************************************************************/
const topNav = document.getElementById("topNav");
const CTA = document.getElementById("CTA");

function hamburger() {
	if (topNav.className === "mobile") {
		topNav.className = "";
		CTA.style.display = "block";
	} else {
		topNav.className = "mobile";
		CTA.style.display = "none";
	}
}


/*******************************************************************
 * detect if #book is visible in viewport to show/hide CTA
 *******************************************************************/
const book = document.getElementById("book");

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
window.onscroll = function() {
	if (isInViewport(book)) {
		CTA.style.display = "none";
	} else {
		CTA.style.display = "inherit";
	}
}


/*******************************************************************
 * While on pages index.html or rooms.html, 
 * if #book is not visible in viewport and CTA (BOOK NOW) is clicked, 
 * scroll to the date picker section.
 * If on any other page, then go to rooms.html.
 *******************************************************************/
function scrollToBook() {
	let currentPage = window.location.pathname; // current page URL
	if (currentPage.endsWith("index.html") || currentPage.endsWith("rooms.html")) {
		const rootFontSize = 16;
		const yOffset = book.getBoundingClientRect().top + window.pageYOffset - (4.5*rootFontSize);
		window.scrollTo({ top: yOffset, behavior: "smooth" });
	}
	else {
		window.location.href = "rooms.html";
	}
}


/*******************************************************************
 * When the footer/address line is clicked, check current page:
 * if on index.html, then scroll to the map/location section;
 * if on any other page, then go to index.html#section_map.
 *******************************************************************/
function scrollToMap() {
	let currentPage = window.location.pathname; // current page URL
	if (currentPage.endsWith("index.html")) {
		const map = document.getElementById("section_map");
		const rootFontSize = 16;
		const yOffset = map.getBoundingClientRect().top + window.pageYOffset - (4.5*rootFontSize);
		window.scrollTo({ top: yOffset, behavior: "smooth" });
	}
	else {
		window.location.href = "index.html#section_map";
	}
}


/*******************************************************************
 * modal handling
 *******************************************************************/
const modalDatePicker = document.getElementById("modal_date_picker");
const modalGuests = document.getElementById("modal_guests");
let monthControl = 0;

window.onclick = function(event) {
	if (event.target == modalDatePicker) {
		modalDatePicker.style.display = "none";
	}
	if (event.target == modalGuests) {
		modalGuests.style.display = "none";
	}
}
// draw two month calendars ---------------------------
function showModalDatePicker(n) {
	monthControl = n;
	drawMonth("month_left", n);
	drawMonth("month_right", n+1);
}
function drawMonth(monthID, n) {
	let current_month = document.getElementById(monthID);
	let month_content = "";
	let start_day = new Date(now.getFullYear(), now.getMonth()+n, 1);
	let end_day = new Date(now.getFullYear(), now.getMonth()+n+1, 0);
	let running_day = new Date(now.getFullYear(), now.getMonth()+n, 1);
	//d1.setFullYear(date1.getFullYear(), date1.getMonth(), date1.getDate());
	//d2.setFullYear(date2.getFullYear(), date2.getMonth(), date2.getDate());

	// add month name as title
	month_content += "<span id='month_left_title' class='month_title'>" + month_full[start_day.getMonth()] + " " + start_day.getFullYear() + "</span>\n";
	// add weekday names
	for (let i=0; i < 7; i++) {
		month_content += "<span class='weekday_name_item'>" + weekday_name[i] + "</span>";
	}
	// add empty grid items before the first day of the month
	for (i=0; i < start_day.getDay(); i++) {
		month_content += "<span>&nbsp;</span>";
	}
	// add days from start_day (e.g. 1) to end_day (e.g. 31)
	for (i=1; i < end_day.getDate()+1; i++) {
		let txtStyle = "calendar_item"; 
		let txtOnclick = "";

		running_day.setDate(i); 
		if (running_day > today) { // future
			txtStyle += "";
			txtOnclick = " onclick='chooseDate(" + running_day.getFullYear() + "," + running_day.getMonth() + "," + running_day.getDate() + ")'";
		}
		else if (running_day < today ) { // past
			txtStyle += " passed";
			txtOnclick = "";
		}
		else { // today
			txtStyle += " today";
			txtOnclick = " onclick='chooseDate(" + running_day.getFullYear() + "," + running_day.getMonth() + "," + running_day.getDate() + ")'";
		}
		if (!((running_day > d1) || (running_day < d1)) || 
		    !((running_day > d2) || (running_day < d2))) {
			txtStyle += " selected_date_item";
		}
		month_content += "<span id='" + running_day.getFullYear() + "_" + running_day.getMonth() + "_" + i + "' class='" + txtStyle + "'" + txtOnclick + ">" + i + "</span>";
	}
	// show content in the target calendar
	current_month.innerHTML = month_content;
	modalDatePicker.style.display = "block";
}

// calculate the temporary from_date and to_date when any date is clicked
function chooseDate(yy, mm, dd) {
	// for debug:
	// alert(yy + "," + mm + "," + dd);
	let selected = new Date(yy, mm, dd);
	
	if (clickTime == 0) {
		d1.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
		d2.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate()+1);
		clickTime = 1;
	}
	else { // clickTime == 1
		if (!(selected < d2)) {
			d2.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
			clickTime = 0;
		}
		else {
			d1.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
			d2.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate()+1);
		}
	}
	// redraw selected dates
	const selectedDates = document.querySelectorAll('.selected_date_item');
	selectedDates.forEach(selectedDate => {
		selectedDate.classList.remove("selected_date_item");
	});
	document.getElementById(d1.getFullYear() + "_" + d1.getMonth() + "_" + d1.getDate()).classList.add("selected_date_item");
	document.getElementById(d2.getFullYear() + "_" + d2.getMonth() + "_" + d2.getDate()).classList.add("selected_date_item");
	// for debug:
	// alert("date1=" + date1 + "\ndate2=" + date2 + "\nd1=" + d1 + "\nd2=" + d2 + "\ntime=" + clickTime);
}


// show #modal_guests for guests number selection ------------------
function showModalGuests() {
	document.getElementById("guests_adults_num").innerText = temp_a;
	if (temp_a == 1) {
		adultsMinusBtn.classList.add("disabledBtn");
	}
	document.getElementById("guests_kids_num").innerText = temp_k;
	if (temp_k == 0) {
		kidsMinusBtn.classList.add("disabledBtn");
	}
	if (parseInt(temp_a) + parseInt(temp_k) == 4) {
		adultsPlusBtn.classList.add("disabledBtn");
		kidsPlusBtn.classList.add("disabledBtn");
	}
	modalGuests.style.display = "block";
}


// show booking information -----------------------------------------
function checkRoom() {
	window.location.href = "rooms.html";
}

function chooseRoom(event, roomtype) {
	let callerBtn = event.target;
	if (!callerBtn.classList.contains("exceed")) {
		sessionStorage.setItem("roomtype", roomtype);
		sessionStorage.setItem("caller", "room");
		let msg = "Please confirm your reservation.\n------------------------\n" + "From: " + weekday_name[date1.getDay()] + " " + month_name[date1.getMonth()] + " " + date1.getDate() + ", " + date1.getFullYear() + "\nTo: " + weekday_name[date2.getDay()] + " " + month_name[date2.getMonth()] + " " + date2.getDate() + ", " + date2.getFullYear() + "\nGuests: " + adults + " Adults, " + kids + " Kids\nRoom type: " + roomtype;
		if (confirm(msg)) {
			window.location.href = "confirm.html";
		}
	}
}

function handleExceed() {
	let i;
	let room_btns = document.getElementsByClassName("room_btn");
	// reset all buttons to be available
	for (i = 0; i < room_btns.length; i++) {
		room_btns[i].value = "BOOK NOW!"
		room_btns[i].classList.remove("exceed");
	}
	// set room availability based on guest numbers
	// Not available. Guests exceed limit.
	if (parseInt(adults) + parseInt(kids) > 2) {
		// Standard Room and Honeymoon Suite not available
		room_btns[0].value = "Not Available (exceeds limit)";
		room_btns[4].value = "Not Available (exceeds limit)";
		room_btns[0].classList.add("exceed");
		room_btns[4].classList.add("exceed");
	}
	if (parseInt(adults) + parseInt(kids) > 3) {
		// Deluxe/Superior Room and Executive Suite not available
		room_btns[1].value = "Not Available (exceeds limit)";
		room_btns[2].value = "Not Available (exceeds limit)";
		room_btns[5].value = "Not Available (exceeds limit)";
		room_btns[1].classList.add("exceed");
		room_btns[2].classList.add("exceed");
		room_btns[5].classList.add("exceed");
	}
}


// handle the buttons (close, left, right, cancel, done)
const datePickerCloseBtn = document.getElementById("btn_date_picker_close");
const calendarLeftBtn = document.getElementById("calendar_arrow_left");
const calendarRightBtn = document.getElementById("calendar_arrow_right");
const datePickerCancelBtn = document.getElementById("modal_date_picker_cancel");
const datePickerDoneBtn = document.getElementById("modal_date_picker_done");

datePickerCloseBtn.onclick = function() {
	d1.setFullYear(date1.getFullYear(), date1.getMonth(), date1.getDate());
	d2.setFullYear(date2.getFullYear(), date2.getMonth(), date2.getDate());
	modalDatePicker.style.display = "none";
}
calendarLeftBtn.onclick = function() {
	if (monthControl > 0) { // allows left click
		if (monthControl == 1) { // last left
			calendarLeftBtn.classList.add("disabledBtn");
		}
		showModalDatePicker(monthControl - 1);
	}
}
calendarRightBtn.onclick = function() {
	if (monthControl == 0) { // enable left arrow
		calendarLeftBtn.classList.remove("disabledBtn");
	}
	showModalDatePicker(monthControl + 1);
}
datePickerCancelBtn.onclick = function() {
	d1.setFullYear(date1.getFullYear(), date1.getMonth(), date1.getDate());
	d2.setFullYear(date2.getFullYear(), date2.getMonth(), date2.getDate());
	modalDatePicker.style.display = "none";
}
datePickerDoneBtn.onclick = function() {
	date1.setFullYear(d1.getFullYear(), d1.getMonth(), d1.getDate());
	date2.setFullYear(d2.getFullYear(), d2.getMonth(), d2.getDate());
	updateBookNumbers();
	modalDatePicker.style.display = "none";
	sessionStorage.setItem("date1", date1.toString());
	sessionStorage.setItem("date2", date2.toString());
}

// handle the buttons (close, minus/plus, cancel, done)
const guestsCloseBtn = document.getElementById("btn_guests_close");
const adultsMinusBtn = document.getElementById("adults_minus");
const adultsPlusBtn = document.getElementById("adults_plus");
const kidsMinusBtn = document.getElementById("kids_minus");
const kidsPlusBtn = document.getElementById("kids_plus");
const guestsCancelBtn = document.getElementById("modal_guests_cancel");
const guestsDoneBtn = document.getElementById("modal_guests_done");

guestsCloseBtn.onclick = function() {
	temp_a = adults;
	temp_k = kids;
	modalGuests.style.display = "none";
}
adultsMinusBtn.onclick = function() {
	if (temp_a > 1) { 
		temp_a--; 
		document.getElementById("guests_adults_num").innerText = temp_a;
		if (temp_a == 1) {
			adultsMinusBtn.classList.add("disabledBtn");
		}
	}
	if (parseInt(temp_a) + parseInt(temp_k) < 4) {
		adultsPlusBtn.classList.remove("disabledBtn");
		kidsPlusBtn.classList.remove("disabledBtn");
	}
}
adultsPlusBtn.onclick = function() {
	if (parseInt(temp_a) + parseInt(temp_k) < 4) {
		temp_a++;
		document.getElementById("guests_adults_num").innerText = temp_a;
	}
	if (temp_a == 1) {
		adultsMinusBtn.classList.remove("disabledBtn");
	}
	if (parseInt(temp_a) + parseInt(temp_k) == 4) {
		adultsPlusBtn.classList.add("disabledBtn");
		kidsPlusBtn.classList.add("disabledBtn");
	}
}
kidsMinusBtn.onclick = function() {
	if (temp_k > 0) { 
		temp_k--; 
		document.getElementById("guests_kids_num").innerText = temp_k;
		if (temp_k == 0) {
			kidsMinusBtn.classList.add("disabledBtn");
		}
	}
	if (parseInt(temp_a) + parseInt(temp_k) < 4) {
		adultsPlusBtn.classList.remove("disabledBtn");
		kidsPlusBtn.classList.remove("disabledBtn");
	}
}
kidsPlusBtn.onclick = function() {
	if (parseInt(temp_a) + parseInt(temp_k) < 4) {
		temp_k++;
		document.getElementById("guests_kids_num").innerText = temp_k;
	}
	if (temp_k == 1) {
		kidsMinusBtn.classList.remove("disabledBtn");
	}
	if (parseInt(temp_a) + parseInt(temp_k) == 4) {
		adultsPlusBtn.classList.add("disabledBtn");
		kidsPlusBtn.classList.add("disabledBtn");
	}
}
guestsCancelBtn.onclick = function() {
	temp_a = adults;
	temp_k = kids;
	modalGuests.style.display = "none";
}
guestsDoneBtn.onclick = function() {
	adults = temp_a;
	kids = temp_k;
	updateBookNumbers();
	modalGuests.style.display = "none";
	sessionStorage.setItem("adults", adults);
	sessionStorage.setItem("kids", kids);
	handleExceed();
}

/*******************************************************************
 * slideshow
 *******************************************************************/

// start with the 1st image
let slideIndex = 1; 
showSlides(slideIndex);

// auto-scroll interval 5s
let slideInterval = setInterval(autoSlide, 5000); 
function autoSlide() {
	plusSlides(1);
}

// n=1: slide to the right; n=-1: slide to the left 
function plusSlides(n) {
	clearInterval(slideInterval);
	slideInterval = setInterval(autoSlide, 5000);
	showSlides(slideIndex += n);
}
function currentSlide(n) {
	showSlides(slideIndex = n);
}
function showSlides(n) {
	let i;
	let slides = document.getElementsByClassName("ftslides");
	let dots = document.getElementsByClassName("dot");
	let thumb = document.getElementsByClassName("thumb");
	let thumb_item = document.getElementsByClassName("thumb_item");
	if (n > slides.length) {slideIndex = 1;} // cycle from the beginning
	if (n < 1) {slideIndex = slides.length;} // cycle from the end
	// make each thumb image width = (100/n)% in table
	for (i = 0; i < thumb_item.length; i++) {
		thumb_item[i].style.width = (100/thumb_item.length) + "%";
	}
	// hide all images first
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";  
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
	}
	for (i = 0; i < thumb.length; i++) {
		thumb[i].className = thumb[i].className.replace(" active", "");
	}
	// then only display the current/active one
	slides[slideIndex-1].style.display = "block";  
	dots[slideIndex-1].className += " active";
	thumb[slideIndex-1].className += " active";
	// update the caption with image description and photo credit (from alt)
	let demoalt = thumb[slideIndex-1].alt;
	let photodesc = demoalt.split(';'); 
	caption.innerHTML = photodesc[0] + "<br><span class='credit'>" + photodesc[1] + "</span>";
}


/*******************************************************************
 * manage contact form, 
 * since I'm not using server-side scripts (e.g. PHP, ASP), 
 * I use sessionStorage instead for storing values, 
 * the data will be deleted when the browser is closed.
 *******************************************************************/

function sendMessage() {
	sessionStorage.setItem("name", document.getElementById("name").value);
	sessionStorage.setItem("email", document.getElementById("email").value);
	sessionStorage.setItem("phone", document.getElementById("phone").value);
	sessionStorage.setItem("message", document.getElementById("message").value);
	sessionStorage.setItem("caller", "contact");
	window.location.href = "confirm.html";
}

function showResponse() {
	let response = "";
	let caller = sessionStorage.getItem("caller"); // previous page
	if (caller == "room") {
		response += "<b>From:</b> " + weekday_full[date1.getDay()] + ", " + month_full[date1.getMonth()] + " " + date1.getDate() + ", " + date1.getFullYear() + "<br>";
		response += "<b>To:</b> " + weekday_full[date2.getDay()] + ", " + month_full[date2.getMonth()] + " " + date2.getDate() + ", " + date2.getFullYear() + "<br>";
		response += "<b>Guests:</b> " + sessionStorage.getItem("adults") + " adults, " + sessionStorage.getItem("kids") + " kids<br>";
		response += "<b>Room type:</b> " + sessionStorage.getItem("roomtype");
		document.getElementById("response").innerHTML = response;
		document.getElementById("welcome_contact").style.display = "none";
	}
	else if (caller == "contact") {
		let message = sessionStorage.getItem("message");
		if (message.length > 30) { message = message.substring(0,30) + "..."; }
		response += "<b>Name:</b> " + sessionStorage.getItem("name") + "<br>";
		response += "<b>Email:</b> " + sessionStorage.getItem("email") + "<br>";
		response += "<b>Phone:</b> " + sessionStorage.getItem("phone") + "<br>";
		response += "<b>Message:</b> " + message;
		document.getElementById("response").innerHTML = response;
		document.getElementById("welcome_booking").style.display = "none";
	}
	else {
		/* invalid access */
		history.go(-1);
	}
}

function goBack() {
	history.go(-1);  // previous page = history.back()
}





