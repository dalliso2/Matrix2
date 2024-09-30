package com.dca.matrix.entity_file;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileRepository;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EntityFileServiceImpl implements EntityFileService
{
	private final EntityFileRepository entityFileRepository;
	private final MatrixEntityRepository meRepository;
	private final MFileRepository mfRepository;

	@Override
	public EntityFile save(EntityFile entityFile)
	{
		
		MatrixEntity entity = this.meRepository.findById(entityFile.getMatrixEntity().getId()).orElseThrow(()->
					new MatrixValidationException("Entity with id " + entityFile.getMatrixEntity().getId() + " does not exist.",
							null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
		
		MFile mf = this.mfRepository.findById(entityFile.getMFile().getId()).orElseThrow(()->
						new MatrixValidationException("File with id " + entityFile.getMFile().getId() + " does not exist.",
								null, ApiErrorCode.FILE_DOES_NOT_EXIST));
		
		EntityFile tempEntityFile = new EntityFile();
		tempEntityFile.setMatrixEntity(entity);
		tempEntityFile.setMFile(mf);
		
		return this.entityFileRepository.save(tempEntityFile);
	}

	@Override
	public EntityFile remove(EntityFile entityFile)
	{
		EntityFile ef = this.entityFileRepository.findById(entityFile.getId()).orElseThrow(()->
				new MatrixValidationException("Entity file with id " + entityFile.getId() + " does not exist.",
						null, ApiErrorCode.ENTITY_FILE_DOES_NOT_EXIST));
		
		this.entityFileRepository.delete(ef);
		return ef;
	}

	@Override
	public List<EntityFile> findForEntity(Long entityId)
	{
		MatrixEntity tempEntity = this.meRepository.findById(entityId).orElseThrow(()->
				new MatrixValidationException("Entity with id " + entityId + " does not exist.",
						null, ApiErrorCode.ENTITY_FILE_DOES_NOT_EXIST));		
		
		return this.entityFileRepository.findForEntity(tempEntity);
	}

	@Override
	public Collection<EntityFile> save(Collection<EntityFile> entityFiles)
	{
		List<EntityFile> efs = new LinkedList<EntityFile>();
		entityFiles.forEach(file->efs.add(this.save(file)));
		return efs;
	}
	
}
