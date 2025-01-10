package com.dca.matrix.file;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.dca.matrix.matrix_case.MatrixCase;

public interface FileStorageService
{
	public void init();
	public MFile loadMFile(Long id);
	public Resource load(Long id);
	public Collection<MFile> storeFiles(Long caseId, MultipartFile[] files);
	public Collection<MFile> updateFiles(Collection<MFile> files);
	public Collection<MFile> searchFilesNotLinkedToEntity(Long matrixEntityId, String searchString);
	MFile save(Optional<MatrixCase> caseOpt, MultipartFile file);
	MFile saveFileInputStream(Optional<MatrixCase> caseOpt, InputStream fileInputStream, String originalFileName);
}
