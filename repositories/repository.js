const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a Repo requires a new file name!');
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async create(attrs) {
		attrs.id = this.randomId();

		const records = await this.getAll();
		const record = { ...attrs };

		records.push(record);
		await this.writeAll(records);
		return record;
	}

	async getAll() {
		//open the file called this.filename
		const contents = await fs.promises.readFile(this.filename, { encoding: 'utf8' });
		//Read its contents
		//parse the contents
		const data = JSON.parse(contents);
		//Return the parsed data
		return data;
	}

	async writeAll(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();

		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const foundRecord = records.find((record) => record.id === id);

		if (!foundRecord) {
			throw new Error(`The record with id: ${id} was not found.`);
		}

		Object.assign(foundRecord, attrs);
		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}

			if (found) {
				return record;
			}
		}
	}
};
