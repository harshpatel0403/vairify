import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PublicRoute(props) {
    const [isMounted, setIsMounted] = useState(false);
    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const LanguagesData = useSelector((state) => state?.Auth?.language);

    const navigate = useNavigate(-1);
    const path = location.pathname;

    // console.log(UserDetails, path, "public route user is this");

    useEffect(() => {
        if (UserDetails) {
            navigate("/setup-face-verification");
        }

        if(UserDetails && props.path){
            navigate("/business/community")
        }
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>Please wait..</>
    }

    return props?.children;

}

export default PublicRoute