import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Header';
import createBrowserHistory from '../../history';
import { Button, ListGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import { fetchLicenses } from '../../store/licenseSlice';
import LicenseCard from './LicenseCard';
import { fetchLogbooks } from '../../store/logbookSlice';
import navigate from '../utils/navigate';

const LicenseList = () => {
    const dispatch = useDispatch();

    const userID = useSelector(state => state.auth.userId);
    const licenses = useSelector(state => state.license.licenses);
    const logbooks = useSelector(state => state.logbook.flightlogs);

    useEffect(() => {
        dispatch(fetchLicenses(userID));
        dispatch(fetchLogbooks(userID));
    }, []);

    const isLoading = () => {
        if (!licenses || !logbooks) {
            return (
                <div>
                    Loading...
                </div>
            );
        } else {
            return (
                licenses.map(license => {
                    return (
                        <div key={license.id}>
                            <LicenseCard licenseID={license.id} />
                            <br />
                        </div>
                    );
                })
            );
        }
    }

    if(!userID) {
        navigate("/");
    }

    return (
        <div>
            <Header />
            <div className="mx-auto w-75">
                <br />
                <h2 className='d-flex justify-content-between'>
                    Lizenzen
                    <Button onClick={() => navigate('/licenses/new')} className="ml-auto" variant="primary">Neu</Button>
                </h2>
                <hr />
                <br />
                {isLoading()}
            </div>
        </div>
    );
}

export default LicenseList;