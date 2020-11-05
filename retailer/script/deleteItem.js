function delItem(id) {
    if (confirm("Are you sure you want to delete this Item??")) {
        firebase.database().ref('products/' + id).remove().then(() => {
            alert("The item deleted sucssfully! Refresh the page once.");
        });
    }
}