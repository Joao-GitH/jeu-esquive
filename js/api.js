export class API{
	static url = "backend/api.php";
	
	/**
	 * @returns {Promise<{username: string, score:number}[]>} 
	 */
	static async selectAllUsers(){
		let reponse = await fetch(this.url);
		return await reponse.json();
	}

	/**
	 * @param {string} username 
	 * @param {number} score 
	 * @returns {Promise<{username: string, score:number}[]>} 
	 */
	static async insertScore(username, score){
		let reponse = await fetch(this.url, {
			method: "POST",
			body: JSON.stringify({
				username: username,
				score: score
			})
		});
		return await reponse.json();
	}
}