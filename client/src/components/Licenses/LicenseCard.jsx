import React, { useEffect, useState } from "react";
import { Button, Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogbooks } from "../../store/logbookSlice";
import TakeoffTypeStatus from "./TakeoffTypeStatus";
import CenteredModal from "../CenteredModal";
import { fetchLicenses, patchLicenses } from "../../store/licenseSlice";
import _ from "lodash";
import PermissionStatus from "./PermissionStatus";
import Dashboard from "../Dashboard";
import navigate from "../utils/navigate";

const LicenseCard = (props) => {
    const dispatch = useDispatch();
    const userID = useSelector(state => state.auth.userId);

    const [modalShow, setModalShow] = useState(false);

    const licenses = useSelector(state => state.license.licenses);
    const license = useSelector(state => state.license.licenses.filter(element => {
        return element.id === props.licenseID;
    })[0]);
    const logbook = useSelector(state => state.logbook.flightlogs.filter(element => {
        return element.id === license.logbookID;
    })[0]);

    const handleDelete = () => {
        dispatch(fetchLicenses(userID));
        let indexOfLicense = null;
        const licensesArray = _.cloneDeep(licenses);
        licensesArray.map(tempLicense => {
            if (tempLicense.id === license.id) {
                indexOfLicense = licensesArray.indexOf(tempLicense);
            }
        });
        licensesArray.splice(indexOfLicense, 1);
        const data = { "userID": userID, "patchContent": { "licenses": licensesArray } }
        dispatch(patchLicenses(data));
        setModalShow(false);
    }

    const isLoading = () => {
        if (!license) {
            return (
                <div>
                    Loading...
                </div>
            );
        } else {
            return (
                <Card>
                    <Card.Header as='h4' className="diplay-flex">
                        {license.name}
                        <Button className="mx-2" onClick={() => navigate(`/licenses/edit/${license.id}`)} variant="primary" size="sm">Bearbeiten</Button>
                        <Button onClick={() => setModalShow(true)} variant="danger" size="sm">Löschen</Button>
                    </Card.Header>
                    <Card.Body>
                        {renderCardBody()}
                    </Card.Body>
                    <CenteredModal show={modalShow} onHide={() => setModalShow(false)} title="Lizenz löschen" bodyTitle={license.name} bodyText="Möchten Sie diese Lizenz wirklich löschen?" actions={renderActions()} />
                </Card>
            );
        }
    }

    const renderCardBody = () => {
        if (!logbook) {
            return "Das Flugbuch wurde entweder nicht korrekt geladen, oder es wurde gelöscht. Probieren Sie es erneut. Falls das nicht hilft, stellen Sie sicher, dass das Flugbuch nicht gelöscht wurde, oder wählen Sie in den Lizenzeinstellungen ein anderes aus.";
        } else {
            return (
                <div className="mx-1 my-1">
                    <h5>Berechtigungen</h5>
                    {renderPermissions()}
                    <hr />
                    <h5>Startarten</h5>
                    {renderTakeofftypes()}
                </div>
            );
        }
    }

    const renderActions = () => {
        return (
            <>
                <Button variant="primary" onClick={() => setModalShow(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => handleDelete()}>Delete</Button>
            </>
        );
    }

    const renderPermissions = () => {
        if (license.otherPermissions.length > 0) {
            return (
                license.otherPermissions.map(permission => {
                    return (
                        <div key={permission.id}>
                            <PermissionStatus permission={permission} logbookID={logbook.id} />
                        </div>
                    );
                })
            );
        } else {
            return (
                <div>
                    Sie haben derzeit keine Berechtigungen in Ihrer Lizenz eingetragen.
                </div>
            )
        }
    }

    const renderTakeofftypes = () => {
        if (logbook.takeoffTypes.length > 0) {
            return (
                logbook.takeoffTypes.map(type => {
                    return (
                        <div key={type.id}>
                            <TakeoffTypeStatus item={type} logbookID={logbook.id} />
                        </div>
                    );
                })
            );
        } else {
            return (
                <div>
                    Sie haben derzeit keine Startarten in Ihrem Flugbuch eingetragen.
                </div>
            )
        }
    }

    if (!userID) {
        navigate("/");
    }

    return (
        <div>
            {isLoading()}
        </div>
    );
}

export default LicenseCard;