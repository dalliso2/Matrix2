package com.dca.matrix.file;

import java.util.Collection;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService
{
	public void init();
	public MFile save(Long caseId, MultipartFile file);
	public Resource load(Long id);
	public Collection<MFile> updateFiles(Collection<MFile> files);
	public Collection<MFile> searchFilesNotLinkedToEntity(Long matrixEntityId, String searchString);
}
