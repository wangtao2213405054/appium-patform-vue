import { request } from "@/utils/service"
import type * as Project from "./types/project"
import type * as Folder from "./types/folder"
import type * as Case from "./types/case"

export function apiGetProjectList(data: Project.GetProjectRequestData) {
  return request<Project.ProjectListResponseData>({
    url: "/business/project/list",
    method: "POST",
    data
  })
}

export function apiEditProjectInfo(data: Project.EditProjectRequestData) {
  return request<Project.ProjectEditResponseData>({
    url: "/business/project/edit",
    method: "POST",
    data
  })
}

export function apiDeleteProjectInfo(data: Project.DeleteProjectRequestData) {
  return request<Project.ProjectEditResponseData>({
    url: "/business/project/delete",
    method: "POST",
    data
  })
}

export function apiGetFolderList(data: Folder.GetFolderRequestData) {
  return request<Folder.FolderListResponseData>({
    url: "/business/folder/list",
    method: "POST",
    data
  })
}

export function apiEditFolderInfo(data: Folder.EditFolderRequestData) {
  return request<Folder.FolderEditResponseData>({
    url: "/business/folder/edit",
    method: "POST",
    data
  })
}

export function apiDeleteFolderInfo(data: Folder.DeleteFolderRequestData) {
  return request<Folder.FolderDefaultResponseData>({
    url: "/business/folder/delete",
    method: "POST",
    data
  })
}

export function apiMoveFolderInfo(data: Folder.MoveFolderRequestData) {
  return request<Folder.FolderDefaultResponseData>({
    url: "/business/folder/move",
    method: "POST",
    data
  })
}

export function apiGetCaseList(data: Case.GetCaseRequestData) {
  return request<Case.CaseListResponseData>({
    url: "/business/Case/list",
    method: "POST",
    data
  })
}

export function apiEditCaseInfo(data: Case.EditCaseRequestData) {
  return request<Case.CaseEditResponseData>({
    url: "/business/Case/edit",
    method: "POST",
    data
  })
}

export function apiDeleteCaseInfo(data: Case.DeleteCaseRequestData) {
  return request<Case.CaseEditResponseData>({
    url: "/business/Case/delete",
    method: "POST",
    data
  })
}
