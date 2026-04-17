import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import GlobalService from '../services/global_service';
import { PermissionsByCategory, PermissionsListResponse, Permission } from '../models/permissions_model'; 
import { CONSTANTS } from '../utils/strings/constants';
import { COLORS } from '../utils/theme/colors';

const REMOVED_PERMISSION_KEYS = new Set([
    'reports.view',
    'reports.export',
    'jobs.approve',
    'meetings.cancel',
    'services.approve',
    'events.approve',
    'investors.approve',
]);

const REMOVED_PERMISSION_NAMES = new Set([
    'view reports',
    'export reports',
    'approve job',
    'cancel meeting',
    'approve service',
    'approve event',
    'approve investor',
]);

const normalizeValue = (value?: string): string => (value || '').trim().toLowerCase();

const shouldRemovePermission = (permission: Permission): boolean => {
    const key = normalizeValue(permission.permission_key);
    const name = normalizeValue(permission.permission_name);
    return REMOVED_PERMISSION_KEYS.has(key) || REMOVED_PERMISSION_NAMES.has(name);
};

const filterPermissions = (permissionsByCategory: PermissionsByCategory): PermissionsByCategory => {
    return Object.entries(permissionsByCategory).reduce<PermissionsByCategory>((acc, [category, permissions]) => {
        const filtered = permissions.filter((perm) => !shouldRemovePermission(perm));
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {});
};

const collectAllowedIds = (permissionsByCategory: PermissionsByCategory): Set<string> => {
    return new Set(
        Object.values(permissionsByCategory)
            .flat()
            .map((perm) => perm.permission_id)
    );
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <label className="form-check form-switch">
        <input 
            className="form-check-input" 
            type="checkbox" 
            checked={checked} 
            onChange={onChange}
            style={{ 
                backgroundColor: checked ? COLORS.purple : undefined, 
                borderColor: checked ? COLORS.purple : undefined 
            }}
        />
    </label>
);

interface PermissionsModalProps {
    show: boolean;
    onClose: () => void;
    currentPermissions: string[];
    onSave: (selectedIds: string[]) => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ show, onClose, currentPermissions, onSave }) => {
    const [allPermissions, setAllPermissions] = useState<PermissionsByCategory>({});
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(currentPermissions));
    const [isLoading, setIsLoading] = useState(false);

    const visiblePermissions = filterPermissions(allPermissions);
    const allowedIds = collectAllowedIds(visiblePermissions);
    const selectedVisibleIds = Array.from(selectedIds).filter((id) => allowedIds.has(id));

    useEffect(() => {
        setSelectedIds(new Set(currentPermissions));
    }, [currentPermissions, show]);

    const fetchPermissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response: PermissionsListResponse = await GlobalService.getAdminPermissions(); 
            
            if (response.status && response.permissions) {
                setAllPermissions(response.permissions);
            } else {
                toast.error("Failed to load permissions.");
                setAllPermissions({});
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
            toast.error(CONSTANTS.MESSAGES.CONNECTION_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (show && Object.keys(allPermissions).length === 0) {
            fetchPermissions();
        }
    }, [show, allPermissions, fetchPermissions]);

    const handleToggle = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        if (selectedVisibleIds.length === 0) {
            toast.warning("SubAdmin must have at least one permission.");
            return;
        }

        onSave(selectedVisibleIds);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">SubAdmin Permissions</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {isLoading ? (
                            <p className="text-center">{CONSTANTS.MESSAGES.LOADING_DATA}</p>
                        ) : (
                            Object.entries(visiblePermissions)
                                .map(([category, permissions]) => (
                                <div key={category} className="mb-4 card p-3">
                                    <h6 className="text-capitalize fw-bold border-bottom pb-2">
                                        {category.replace('_', ' ')}
                                    </h6>
                                    {permissions.map((perm: Permission) => (
                                        <div key={perm.permission_id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div>
                                                <p className="mb-0 fw-medium">{perm.permission_name}</p>
                                                <p className="text-muted small mb-0">{perm.description}</p>
                                            </div>
                                            <ToggleSwitch 
                                                checked={selectedIds.has(perm.permission_id)}
                                                onChange={() => handleToggle(perm.permission_id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            {CONSTANTS.BUTTONS.CANCEL}
                        </button>
                        <button type="button" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }} onClick={handleSave} disabled={isLoading || isModalEmpty(visiblePermissions)}>
                            Save Permissions ({selectedVisibleIds.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionsModal;

const isModalEmpty = (permissions: PermissionsByCategory): boolean => {
    return Object.keys(permissions).length === 0;
}