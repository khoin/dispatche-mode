class Sound {
	constructor(audioContext) {
		this.nodes = new Map();

		this.processor = audioContext.createScriptProcessor(8192, 0, 2);
		this.processor.onaudioprocess = this.audioEventHandler.bind(this);
		this.sampleRate = audioContext.sampleRate;

		this.T = 0;

		this.processor.connect(audioContext.destination);
	}

	audioEventHandler(ev) {
		let outputBuffer = ev.outputBuffer;

		let left = outputBuffer.getChannelData(0),
			right = outputBuffer.getChannelData(1);

		// higher value for attack means shorter attack time
		// higher value for decay means shorter decay time
		let env = (t, measure, attack = 5000, decay = 20) => {
			let ts = t / 4 % measure;
			return Math.min(1, Math.exp(ts * attack)-1) * Math.exp(-ts * decay);
		}

		let calc = t => {
			let l = 0, r = 0;
			for (let node of this.nodes.values()) {
				switch (node.type) {
					case 'Aid Response':
						l += Math.sin(Math.PI*2*(node.distance/1)*t*440 + Math.sin(441*Math.PI*t*(node.distance*3))* env(t, 1/(node.distance*2), 1000, 1)) * env(t, 1/(node.distance*2), 1800, 5) * 1/node.distance;
						r += Math.sin(Math.PI*2*(node.distance/1)*t*443 + Math.sin(440*Math.PI*t*(node.distance*3))* env(t, 1/(node.distance*2), 1000, 1)) * env(t, 1/(node.distance*2), 1800, 5) * 1/node.distance;
					break;
					default:
						l += 0;
					break;
				}
			}
			return [l/20,r/20];
		}

		let unit = 1/this.sampleRate;

		for (let s = 0; s < outputBuffer.length; s++ ) {
			let o = calc(this.T);
			left[s] = o[0];
			right[s] = o[1];
			this.T += unit;
		}
	}

	addNode(name, distance, type) {
		this.nodes.set(name, {
			distance: distance,
			type: type
		})
	}
}