const page_settings = {
	num_staves: 12,
	x_position: 0,
	y_position: 0,
	y_offset: 120,
	x_size: 1200,
	y_size: 1950,
}

const stave = {
	timeSig: { n: 4, d: 4 },
	key: { keyName: 'C' }
}

const string_notes = [
	['E/2', 'F/2', 'G/2', 'A/2'],
	['A/2', 'B/2', 'C/3', 'D/3'],
	['D/3', 'E/3', 'F/3', 'G/3'],
	['G/3', 'A/3', 'B/3', 'C/4'],
	['E/2', 'F/2', 'G/2', 'A/2', 'B/2', 'C/3', 'D/3', 'E/3', 'F/3', 'G/3', 'A/3', 'B/3', 'C/4'],
];

const duration = ["w", "h", "", "q"];
const measures_per_line = [8, 6, 6, 4];
const width_multipliers = [3, 3, 3, 2.6];

class NotesForBass {
	
	// Notes for the first position


	constructor(string_number, notes_per_measure=1) {
		this.bass_string_notes = string_notes[string_number - 1];
		this.notes_per_measure = notes_per_measure;
		this.note_type = duration[notes_per_measure - 1];
		this.measures = measures_per_line[notes_per_measure - 1];
		this.width_multiplier = width_multipliers[notes_per_measure - 1];
	}

	make_measures() {
		let notes = [];

		for (let i=0; i < this.measures; i++) {
			// let note = this.bass_string_notes[Math.floor(Math.random() * this.bass_string_notes.length)];

			for (let j=0; j < this.notes_per_measure; j++) {
				let note = this.bass_string_notes[Math.floor(Math.random() * this.bass_string_notes.length)];
				notes.push(new Vex.Flow.StaveNote({clef: "bass", keys: [note], duration: this.note_type, auto_stem: true }));
			}

			notes.push(new Vex.Flow.BarNote(Vex.Flow.Barline.type.SINGLE));
		}
		notes.pop();  // remove the last barline
		return notes;
	}

	make_line() {
		let voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION});
		voice.setStrict(false);
		voice.addTickables( this.make_measures() );
		return voice;
	}

	make_page() {
		let voices = [];
		for (let i=0; i < page_settings.num_staves; i++) {
			voices.push( this.make_line() );
		}
	
		let formatter = new Vex.Flow.Formatter();
		formatter.joinVoices(voices);
	
		formatter.preCalculateMinTotalWidth(voices);
		let width = formatter.getMinTotalWidth();
	
		let staves = [];

		// set initial position for y-axis
		let y = page_settings.y_position;

		for (let i=0; i < page_settings.num_staves; i++) {
			staves.push(new Vex.Flow.Stave(page_settings.x_position, y, width * this.width_multiplier));
			y = y + page_settings.y_offset;
		}
	
		let renderer = new Vex.Flow.Renderer('bass', Vex.Flow.Renderer.Backends.SVG);
		renderer.resize(page_settings.x_size, page_settings.y_size);
	
		let context = renderer.getContext();
		
		for (let i=0; i < page_settings.num_staves; i++) {
			staves[i].addClef('bass', 'default').addTimeSignature(stave.timeSig.n + '/' + stave.timeSig.d).setKeySignature(stave.key.keyName);
			formatter.formatToStave(voices, staves[i]);
			staves[i].setContext(context).draw();
			voices[i].draw(context, staves[i]);
		}
	}

}












