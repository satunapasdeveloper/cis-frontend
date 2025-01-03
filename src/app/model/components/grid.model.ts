import { ColDef } from "ag-grid-community";
import { FormModel } from "./form.model";

export namespace GridModel {
    export interface IGridToolbar {
        id: string;
        title: string;
        icon: string;
    }

    export interface IGridColumn {
        field: string;
        headerName: string;
        format?: 'date' | 'datetime' | 'number' | 'currency';
        class?: string;
        renderAsCheckbox?: boolean;
        renderAsPills?: boolean;
        pillClass?: string;
        width?: string;
    }

    export interface IGridCustomSearch {
        id: string;
        placeholder: string;
        type: 'text' | 'dropdown' | 'date' | 'number';
        dropdownProps?: FormModel.DropdownProps;
    }

    export interface IGrid {
        id: string;
        column: IGridColumn[];
        dataSource: any[];
        height: string;
        showPaging: boolean;
        showSearch?: boolean;
        isCustomSearch?: boolean;
        customSearchProps?: IGridCustomSearch[];
        searchKeyword?: string;
        searchPlaceholder?: string;
        showSort?: boolean;
        toolbar?: string[];
        totalRows?: number;
    }
}