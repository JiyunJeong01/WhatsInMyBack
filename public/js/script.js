function followb_click(member_id, follow_id, button) {
    is_following = (button.innerText == '언팔로우') ? true : false;
    const followUrl = `/profile/${member_id}/${follow_id}`;
    const config = {
        method: is_following ? "DELETE" : "PUT"
    };

    fetch(followUrl, config)
        .then(response => response.json())
        .catch(error => console.log('Fetch error: ', error));

    button.innerText = is_following ? '팔로우' : '언팔로우';
}