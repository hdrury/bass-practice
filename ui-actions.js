var notes_per_measure = 1;
var string = null;
function showStringNotes(e) {
	var _id = parseInt(e.target.id);
	
	if (_id) {
		switch (_id) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			string = _id;
			for ( let note of document.getElementsByClassName("strings") ) {
				note.classList.remove("is-info");
			}
			document.getElementById(_id).classList.add("is-info");
			break;
		case 6:
			notes_per_measure = 1;
			break;
		case 7:
			notes_per_measure = 2;
			break;
		case 8:
			notes_per_measure = 4;
			break;
		}
		
		if ( (_id > 5) && (_id < 9) ) {
			for ( let note of document.getElementsByClassName("notes") ) {
				note.classList.remove("is-info");
			}
			document.getElementById(_id).classList.add("is-info");
		}

		document.getElementById("bass").innerHTML = "";
		new NotesForBass(string, notes_per_measure).make_page();
	}

}