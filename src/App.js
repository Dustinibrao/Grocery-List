import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
	let list = localStorage.getItem("list");
	if (list) {
		return JSON.parse(localStorage.getItem("list"));
	} else {
		return [];
	}
};

function App() {
	const [name, setName] = useState("");
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		type: "",
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		// checking if value is empty. If empty is true, display alert
		if (!name) {
			// display alert
			showAlert(true, "danger", "please enter value");
		} else if (name && isEditing) {
			//deal with edit
			setList(
				list.map((item) => {
					if (item.id === editID) {
						return { ...item, title: name };
					}
					return item;
				})
			);
			setName("");
			setEditID(null);
			setIsEditing(false);
			showAlert(true, "success", "value changed");
		} else {
			showAlert(true, "success", "item added to the list");
			// if everything is right
			// show alert
			const newItem = {
				id: new Date().getTime().toString(),
				title: name,
			};
			setList([...list, newItem]);
			setName("");
		}
	};
	const showAlert = (show = false, type = "", msg = "") => {
		setAlert({ show: show, type, msg });
	};
	const clearList = () => {
		showAlert(true, "danger", "empty list");
		setList([]);
	};
	const removeItem = (id) => {
		showAlert(true, "danger", "item removed");
		setList(list.filter((item) => item.id !== id));
	};
	const editItem = (id) => {
		const specificItem = list.find((item) => item.id === id);
		setIsEditing(true);
		setEditID(id);
		setName(specificItem.title);
	};
	//save to local storage
	useEffect(() => {
		localStorage.setItem("list", JSON.stringify(list));
	}, [list]);
	return (
		<section className="section-center">
			<form className="grovery-form" onSubmit={handleSubmit}>
				{alert.show && (
					<Alert {...alert} removeAlert={showAlert} list={list} />
				)}
				<h3>Grocery List</h3>
				<div className="form-control">
					<input
						type="text"
						className="grocery"
						placeholder="e.g eggs"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button type="submit" className="submit-btn">
						{isEditing ? "edit" : "submit"}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className="grocery-container">
					<List
						items={list}
						removeItem={removeItem}
						editItem={editItem}
					/>
					<button className="clear-btn" onClick={clearList}>
						clear items
					</button>
				</div>
			)}
		</section>
	);
}

export default App;
