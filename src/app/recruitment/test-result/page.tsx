/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import testResultApiRequest from "@/apis/testResult.api";
import FormCRUD from "@/app/recruitment/test-result/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { TestResult, testResultDefault } from "@/data/schema/testResult.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Recruitment",
    url: "",
  },
  {
    name: "TestResult",
    url: "/recruitment/test-result",
  },
];

//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: "name",
    title: "Tên",
    options: [
      {
        label: "Bắt đầu bằng W",
        value: "W",
      },
      {
        label: "Bắt đầu bằng H",
        value: "H",
      },
    ],
  },
];

//react query key
const QUERY_KEY = {
  keyList: "testResults",
};

export default function TestResultList() {
  const [detail, setDetail] = useState<TestResult>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => testResultApiRequest.getList(),
  });

  const columnsDef: ColumnDef<TestResult>[] = [
    {
      accessorKey: "questionText",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Câu hỏi" />
      ),
      cell: ({ row }) => (
        <div className="w-[200px]">{row.getValue("questionText")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "applicantName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người trả lời" />
      ),
      cell: ({ row }) => (
        <div className="w-[200px]">{row.getValue("applicantName")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "point",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người trả lời" />
      ),
      cell: ({ row }) => (
        <div className="w-[200px]">{row.getValue("point")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "comment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người trả lời" />
      ),
      cell: ({ row }) => (
        <div className="w-[200px]">{row.getValue("comment")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          handleView={() => handleView(row)}
          handleEdit={() => handleEdit(row)}
          handleDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  //ACTION HANDLER
  const handleAddNew = () => {
    setDetail(testResultDefault);
    setMode(CRUD_MODE.ADD);
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<TestResult>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData =
      listDataQuery.data?.metadata?.find((x) => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<TestResult>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT);
    const selectedData =
      listDataQuery.data?.metadata?.find((x) => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<TestResult>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.DELETE);
    const selectedData =
      listDataQuery.data?.metadata?.find((x) => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">TestResult list</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          data={listDataQuery.data?.metadata}
          columns={columnsDef}
          filters={dataFilter}
          searchField="name"
        >
          <Button
            onClick={handleAddNew}
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex me-2 bg-primary text-white"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </DataTable>
      </div>
      <FormCRUD
        openCRUD={openCRUD}
        setOpenCRUD={setOpenCRUD}
        mode={mode}
        detail={detail}
      />
    </>
  );
}
