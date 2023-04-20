import React, { useEffect, useRef, useState } from "react";
import { UserServices } from "./UserServices";
import { UserType } from "./UserType";
import { RoleType } from "../role/RoleType";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Dropdown } from 'primereact/dropdown';
import { Password } from "primereact/password";


const UserPage = () => {

    let emptyRole: RoleType = {
        id: '',
        name: '',
    };

    let emptyUser: UserType = {
        id: '',
        fullname: '',
        email: '',
        role: emptyRole
    };


    const [users, setUsers] = useState<UserType[]>([]);
    const [user, setUser] = useState<UserType>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<UserType[]>>(null);
    const router = useRouter()

    const [roles, setRoles] = useState<RoleType[]>([]);
    const [roleId, setRoleId] = useState<RoleType>(emptyRole);


    useEffect(() => {
        UserServices.getUsers().then((data) => setUsers(data));
        UserServices.getRoles().then((data) => setRoles(data));
    }, []);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
                </div>
            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const onInputChangeFullname = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user['fullname'] = val;
        setUser(_user);
    };
    const onInputChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user['email'] = val;
        setUser(_user);
    };
    const onInputChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user['password'] = val;
        setUser(_user);
    };
    const onInputChangeRoleId = (e: RoleType) => {
        setRoleId(e)
        const val = e || '';
        let _user = { ...user };
        _user['roleId'] = e.id;
        _user['role'] = e;
        setUser(_user);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const fullnameBodyTemplate = (rowData: UserType) => {
        return (
            <>
                <span className="p-column-title">Fullname</span>
                {rowData.fullname}
            </>
        );
    };

    const emailBodyTemplate = (rowData: UserType) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };
    const roleIdBodyTemplate = (rowData: UserType) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {rowData.role?.name}
            </>
        );
    };
    const actionBodyTemplate = (rowData: UserType) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };
    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const confirmDeleteSelected = () => {
        // setDeleteProductsDialog(true);
    };
    const saveUser = () => {
        setSubmitted(true);
        console.log(user);

        if (user.fullname.trim() && user.email.trim()) {
            if (user.id !== '') {
                UserServices.updateUser(user).then((data) => {
                    // router.refresh()
                    console.log(data);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                    setUsers(data)
                })
            } else {
                UserServices.createUser(user).then((data) => {
                    // router.refresh()
                    console.log(data);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                    setUsers(data)
                })
            }

            setUserDialog(false);
            setUser(emptyUser);
        }

    }
    const editUser = (user: UserType) => {
        setRoleId(user.role)
        setUser({ ...user });
        setUserDialog(true);
    };
    const deleteUser = () => {
        // let _users = users.filter((val) => val.id !== user.id);

        UserServices.deleteUser(user).then((data) => {
            setUsers(data);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        })

    };
    const confirmDeleteUser = (user: UserType) => {
        setUser(user);
        setDeleteUserDialog(true);
    };


    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value as UserType[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="username" header="Username" sortable body={fullnameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="role" header="Role" sortable body={roleIdBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}

                        <div className="field">
                            <label >Full Name</label>
                            <InputText id="name" value={user.fullname} onChange={(e) => onInputChangeFullname(e)} required autoFocus className={classNames({ 'p-invalid': submitted && !user.fullname })} />
                            {submitted && !user.fullname && <small className="p-invalid">Full Name is required.</small>}
                        </div>
                        <div className="field">
                            <label >Email</label>
                            <InputText id="name" value={user.email} onChange={(e) => onInputChangeEmail(e)} required className={classNames({ 'p-invalid': submitted && !user.email })} />
                            {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        </div>
                        <div className="field">
                            <label >Password</label>
                            <Password toggleMask id="password" value={user.password} onChange={(e) => onInputChangePassword(e)} required className={classNames({ 'p-invalid': submitted && !user.password })} placeholder="********" />
                            {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">State</label>
                            <Dropdown id="state" value={user.role} onChange={(e) => onInputChangeRoleId(e.target.value)} options={roles} required optionLabel="name" placeholder="Select One" className={classNames({ 'p-invalid': submitted && !user.role })}></Dropdown>
                            {submitted && !user.role && <small className="p-invalid">Role is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Are you sure you want to delete <b>{user.fullname}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected users?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default UserPage;
