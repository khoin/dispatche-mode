fetchDispatches = () => {
	return new Promise((resolve, reject) => {
		fetch("https://students.washington.edu/koi/dispatche/through.php")
		.then(res => res.text())
		.then(data => {
			let parser = new DOMParser();
			let doc = parser.parseFromString(data, "text/html");

			let output = [];

			doc.querySelectorAll("[colspan='6']")[1].querySelectorAll("[id^='row']").forEach(row => {
				output.push({
					dateTime : row.children[0].textContent,
					number: row.children[1].textContent,
					level: parseInt(row.children[2].textContent),
					unit: row.children[3].textContent,
					location: row.children[4].textContent,
					type: row.children[5].textContent
				})
			})
			resolve(output);
		})	
})
}