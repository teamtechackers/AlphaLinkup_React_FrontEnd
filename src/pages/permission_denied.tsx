import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PermissionDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card>
              <Card.Body className="text-center">
                <h3 className="text-danger">Permission Denied</h3>
                <p className="text-muted">
                  You don't have permission to access this page. Please contact your administrator.
                </p>
                <Button variant="primary" onClick={() => navigate('/admin/dashboard')}>
                  Go to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied;
