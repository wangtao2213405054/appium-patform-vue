import { request } from "@/utils/service"
import type * as Project from "./types/project"


export function getProjectList(data: Project.GetProjectRequestData) {
  return request<Project.ProjectListResponseData>({
    url: "/business/project/list",
    method: "POST",
    data
  })
}

export function editProjectInfo(data: Project.EditProjectRequestData) {
  return request<Project.ProjectEditResponseData>({
    url: "/business/project/edit",
    method: "POST",
    data
  })
}

export function deleteProjectInfo(data: Project.DeleteProjectRequestData) {
  return request<Project.ProjectEditResponseData>({
    url: "/business/project/delete",
    method: "POST",
    data
  })
}
