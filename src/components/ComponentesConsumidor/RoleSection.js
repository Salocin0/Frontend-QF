import CampoTexto from "./CampoTexto";
import Boton from "./Boton";
export const RoleSection = ({
    title,
    editMode,
    fields = [],
    onEditToggle,
    onSave,
    onCancel,
    onDisable,
    modalConfirmation,
  }) => (
    <div>
      <h2>{title}</h2>
      {editMode ? (
        <>
          <Boton texto="Guardar" onClick={onSave} />
          <Boton texto="Cancelar" onClick={onCancel} />
        </>
      ) : (
        <Boton texto="Editar" onClick={onEditToggle} />
      )}
  
      <form>
        {fields.map((field) => (
          <CampoTexto
            key={field.id}
            id={field.id}
            label={field.label}
            tipo={field.type || "text"}
            valor={field.value}
            onChange={field.onChange}
            editable={editMode}
            opciones={field.options} // Para inputs tipo select
          />
        ))}
      </form>
  
      {onDisable && (
        <Boton
          texto="Deshabilitar Usuario"
          onClick={onDisable}
          estilo={{ backgroundColor: "#d9534f", color: "white" }}
        />
      )}
      {modalConfirmation}
    </div>
  );
  