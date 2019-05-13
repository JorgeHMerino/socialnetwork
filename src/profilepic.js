import React from "react";

export default function ProfilePic(props) {
    const image = props.image || "./defaultpicture.jpg";
    console.log("image in profilepic: ", props);
    console.log("firstname in profilepic: ", props.first);
    return (
        <img
            id="profilepic"
            src={image}
            alt={`${props.first} ${props.last}`}
            onClick={props.showUploader}
        />
    );
}
