import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';
let token = null;



const showUserProfile = async (token) => {
    const endpoint = `${rootURL}/api/profile`; //find endpoints
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    //const userProfileHtmlChunk = data.map(userProfileToHTML).join('');
    const userProfileHtmlChunk = userProfileToHTML(data);
    document.querySelector('ul').innerHTML =userProfileHtmlChunk; //is this the right thing?
}



const userProfileToHTML = user => {
    return ` <ul>
    <li><span>${user.username}</span></li> 
    <li><a href="#"> Sign out </a></li>
</ul>
    `
} //?




const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    const storiesHtmlChunk = data.map(storyToHTML).join('');
    document.querySelector('.stories').innerHTML =storiesHtmlChunk;
}

const storyToHTML = story => {
    return `<div>
        <img src ="${story.user.thumb_url}" class="pic"/>
        <p>${story.user.username}</p>

    </div>
    `
}

const showPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':  'Bearer '+ token
        }
    })
    const data = await response.json();
    console.log (data);
    const postsHtmlChunk = data.map(postToHTML).join(''); 
    document.querySelector('.cards').innerHTML = postsHtmlChunk;
}

const getBookmarkButton = post => {
    console.log(post.current_user_bookmark_id)
    if (post.current_user_bookmark_id){
        return `
        <button class="icon-button" onclick="unbookmarkPost(${post.current_user_bookmark_id}, ${post.id})">
        <i class="fas fa-bookmark"></i>
            </button>
           
         `;
    } else {
        return `
           <button class="icon-button"onclick="bookmarkPost(${post.id})">
           <i class="far fa-bookmark"></i>
           </button>
        `;
    }

}

 window.bookmarkPost = async (postId) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/bookmarks/`;
    const postData = {
        "post_id": postId 
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postId);
}

window.unbookmarkPost = async (bookmarkId, postId) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/bookmarks/${bookmarkId}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postId);
}



const getLikeButton = post => {
    if (post.current_user_like_id){
        return `
        <button class="icon-button" onclick="unlikePost(${post.current_user_like_id}, ${post.id})">
        <i class="fas fa-heart"></i>
            </button>
           
         `;
    } else {
        return `
           <button class="icon-button" onclick="likePost(${post.id})">
           <i class="far fa-heart"></i>
           </button>
        `;
    }

}

window.likePost = async (postId) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/posts/likes/`;
    const postData = {
        "post_id": postId 
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postId);
}

window.unlikePost = async (likeId, postId) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/posts/likes/${likeId}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postId);
}
const targetElementAndReplace = (selector, newHTML) => { 
	const div = document.createElement('div'); 
	div.innerHTML = newHTML;
	const newEl = div.firstElementChild; 
    const oldEl = document.querySelector(selector);
    oldEl.parentElement.replaceChild(newEl, oldEl);
}

const requeryRedraw = async (postId) =>{
    const endpoint = `${rootURL}/api/posts/${postId}`;
    console.log(endpoint);
    const response = await fetch (endpoint, {
        headers: {
            'Content-Type' : 'application/json', 
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json(); 
    console.log(data);
    const htmlString = postToHTML(data);
    targetElementAndReplace(`#post_${postId}`,htmlString);
    
}






const postToHTML = post => {
    return `
 <section class ="card" id="post_${post.id}">
    <div class="header">
        <h3> "${post.user.username}" </h3>
        <button class="icon-button"><i class="fas fa-ellipsis-h"></i></button>
    </div>
    <img src="${post.image_url}" alt=" ${post.alt_text}" width="300" height="300">
    <div class="info">
        <div class="buttons">
             <div>
                ${getLikeButton(post)}
                <button class="icon-button"><i class="far fa-comment"></i></button>
                <button class="icon-button"><i class="far fa-paper-plane"></i></button>
            </div>
            <div>
                ${getBookmarkButton(post)}
            </div>
        </div>
        <p class="likes"><strong>30 likes</strong></p>
        <div class="">
            <p>
                <strong>${post.user.username}</strong> 
                ${post.caption}
            </p>
        </div>
        ${showCommentAndButton(post)}
         <div class="add-comment">
            <div class="input-holder">
                <i class="far fa-smile"></i>
                 <input type="text" placeholder="Add a comment...">
            </div>
            <button class="button" onclick="addComment(${post.id})">Post</button>
        </div>
    </div>
    </section>
    `
}


function showCommentAndButton (post) {
    if (post.comments.length === 0) {
        return "";
    }
    else if (post.comments.length === 1) {
        return `
        <div class="comments">
          <p>
            <strong>${post.comments[0].user.username}</strong> 
            ${post.comments[0].text}
         </p>
         <p class="timestamp">${post.comments[0].display_time}</p>
      </div>
     `
    }
    else if (post.comments.length > 1){
        const lastIndex = post.comments.length -1; 
        return `
        <div class="comments">
          <p>
            <strong>${post.comments[lastIndex].user.username}</strong> 
            ${post.comments[lastIndex].text}
         </p>
         <p class="timestamp">${post.comments[lastIndex].display_time}</p>
         <button class="button" onClick="showModal(${post.id})">more</button>
      </div>
     ` 
     // for the last comment in the array 
    }
//     /* 
//     if post.comments.length === 0 
//     then return empty string 
//     if post.comments.length === 1 
//     then return just that comment representation 
//     if post.comments.legnth > 1 
//     then return most recent comment representation and button "view x comments*/


//     return `
//     <div class="comments">
//                     <p>
//                         <strong>lizzie</strong> 
//                         Here is a comment text text text text text text text text.
//                     </p>
//                     <p>
//                         <strong>vanek97</strong> 
//                         Here is another comment text text text.
//                     </p>
//                     <p class="timestamp">1 day ago</p>
//                 </div>
//     `
 }

  window.showModal=function(postId) {
    fetch(`${rootURL}/api/posts/${postId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(post => {
        console.log(post);
        const template = ` 
        <div class="image" style="background-image: url('${post.image_url}');"></div>
         <section class="the-comments">
         ${post.comments.map(commentToHtml).join("")}
        </section>
        `
        document.querySelector (".modal-body").innerHTML=template;
    });
    document.querySelector("#modal").classList.remove("hidden");
  }
function commentToHtml(comment) {
    return `
    <div class="row">
        <p>
        <strong>${comment.user.username}</strong>
        ${comment.text}
        </p>
        <button class="icon-button"><i class="far fa-heart"></i></button>
    </div>
     `

}

 window.hideModal=function(){
    document.querySelector("#modal").classList.add("hidden");
 }

 window.addComment = async(postId)=>{
    const postData = {
        "post_id": postId ,
        "text": document.querySelector(`#post_${postId} input`).value
    };
    const response = await fetch(`${rootURL}/api/comments`, {
         method: "POST",
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    });
    const data = await response.json();
    console.log(data);
    requeryRedraw(postId);
 }

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    token = await getAccessToken(rootURL, 'webdev', 'password');
    console.log (token);
    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showUserProfile(token);
}



initPage();
