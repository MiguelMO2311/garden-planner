import AccountProfile from "./AccountProfile";
import AccountPassword from "./AccountPassword";
import AccountDelete from "./AccountDelete";

export default function AccountPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mi cuenta</h1>

            <p className="text-gray-600 mb-6">
                Aquí podrás editar tus datos, cambiar contraseña y eliminar tu cuenta.
            </p>

            <AccountProfile />
            <AccountPassword />
            <AccountDelete />
        </div>
    );
}
